import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Task, TaskStatus, CreateTaskInput } from './types';

/**
 * TaskStateManager - Single source of truth for all task state
 * 
 * This class maintains the task list, enforces business rules, and handles persistence.
 * It is the backend for the agent API and notifies the WebView of changes.
 */
export class TaskStateManager {
    private tasks: Task[] = [];
    private onDidChangeEmitter = new vscode.EventEmitter<Task[]>();
    public readonly onDidChange = this.onDidChangeEmitter.event;

    constructor(private workspaceRoot: string) {
        this.load();
    }

    /**
     * Agent API: Create multiple tasks in 'ready' status
     * Called when agent breaks down a user prompt into tasks
     */
    public createTasks(inputs: CreateTaskInput[]): void {
        const newTasks: Task[] = inputs.map(input => ({
            id: this.generateId(),
            title: input.title,
            status: 'ready' as TaskStatus,
            order: input.order,
            createdBy: 'agent' as const
        }));

        this.tasks.push(...newTasks);
        this.tasks.sort((a, b) => a.order - b.order);
        this.save();
        this.onDidChangeEmitter.fire(this.tasks);
    }

    /**
     * Agent API: Move a task to a different status (column)
     * Enforces: only one task can be 'in_progress' at a time
     */
    public setTaskStatus(taskId: string, status: TaskStatus): void {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) {
            throw new Error(`Task ${taskId} not found`);
        }

        // Enforce: only one task can be in_progress
        if (status === 'in_progress') {
            const currentInProgress = this.tasks.find(t => t.status === 'in_progress' && t.id !== taskId);
            if (currentInProgress) {
                throw new Error(`Cannot move task to in_progress. Task "${currentInProgress.title}" is already in progress.`);
            }
        }

        task.status = status;
        this.save();
        this.onDidChangeEmitter.fire(this.tasks);
    }

    /**
     * Agent API: Clear all tasks
     * Called when agent receives a new user prompt
     */
    public resetBoard(): void {
        this.tasks = [];
        this.save();
        this.onDidChangeEmitter.fire(this.tasks);
    }

    /**
     * Get current task list (for WebView initialization)
     */
    public getTasks(): Task[] {
        return [...this.tasks];
    }

    /**
     * Persistence: Save tasks to .vscode/kanban-agent.json
     */
    private save(): void {
        const vscodePath = path.join(this.workspaceRoot, '.vscode');
        const filePath = path.join(vscodePath, 'kanban-agent.json');

        try {
            // Ensure .vscode directory exists
            if (!fs.existsSync(vscodePath)) {
                fs.mkdirSync(vscodePath, { recursive: true });
            }

            fs.writeFileSync(filePath, JSON.stringify(this.tasks, null, 2), 'utf8');
        } catch (error) {
            console.error('Failed to save tasks:', error);
        }
    }

    /**
     * Persistence: Load tasks from .vscode/kanban-agent.json
     */
    private load(): void {
        const filePath = path.join(this.workspaceRoot, '.vscode', 'kanban-agent.json');

        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                this.tasks = JSON.parse(content);
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
            this.tasks = [];
        }
    }

    /**
     * Generate unique task ID
     */
    private generateId(): string {
        return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
