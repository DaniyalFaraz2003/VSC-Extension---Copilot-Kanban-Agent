import * as vscode from 'vscode';
import { TaskStateManager } from './taskStateManager';
import { CreateTaskInput, TaskStatus } from './types';

/**
 * Language Model Tool: Create Tasks
 */
export class CreateTasksTool implements vscode.LanguageModelTool<{ tasks: CreateTaskInput[] }> {
    constructor(private taskManager: TaskStateManager) { }

    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<{ tasks: CreateTaskInput[] }>,
        _token: vscode.CancellationToken
    ) {
        const taskCount = options.input.tasks.length;
        const taskList = options.input.tasks
            .map(t => `- ${t.title} (order: ${t.order})`)
            .join('\n');

        return {
            invocationMessage: `Creating ${taskCount} task(s) on Kanban board`,
            confirmationMessages: {
                title: 'Create Kanban Tasks',
                message: new vscode.MarkdownString(
                    `Create the following tasks on the Kanban board?\n\n${taskList}`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<{ tasks: CreateTaskInput[] }>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        try {
            this.taskManager.createTasks(options.input.tasks);

            const taskTitles = options.input.tasks.map(t => t.title).join(', ');
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    `Created ${options.input.tasks.length} tasks on the Kanban board: ${taskTitles}. All tasks are in 'ready' status.`
                )
            ]);
        } catch (error) {
            throw new Error(`Failed to create tasks: ${error}`);
        }
    }
}

/**
 * Language Model Tool: Update Task Status
 */
export class UpdateTaskStatusTool implements vscode.LanguageModelTool<{ taskId: string; status: TaskStatus }> {
    constructor(private taskManager: TaskStateManager) { }

    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<{ taskId: string; status: TaskStatus }>,
        _token: vscode.CancellationToken
    ) {
        const tasks = this.taskManager.getTasks();
        const task = tasks.find(t => t.id === options.input.taskId);
        const taskTitle = task ? task.title : options.input.taskId;

        return {
            invocationMessage: `Updating task status to ${options.input.status}`,
            confirmationMessages: {
                title: 'Update Task Status',
                message: new vscode.MarkdownString(
                    `Update task **${taskTitle}** to status **${options.input.status}**?`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<{ taskId: string; status: TaskStatus }>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        try {
            const tasks = this.taskManager.getTasks();
            const task = tasks.find(t => t.id === options.input.taskId);

            if (!task) {
                throw new Error(
                    `Task ID "${options.input.taskId}" not found. Use the get_tasks tool to get valid task IDs.`
                );
            }

            this.taskManager.setTaskStatus(options.input.taskId, options.input.status);

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    `Task "${task.title}" status updated from "${task.status}" to "${options.input.status}".`
                )
            ]);
        } catch (error) {
            throw new Error(`Failed to update task status: ${error}`);
        }
    }
}

/**
 * Language Model Tool: Get Tasks
 */
export class GetTasksTool implements vscode.LanguageModelTool<Record<string, never>> {
    constructor(private taskManager: TaskStateManager) { }

    async prepareInvocation(
        _options: vscode.LanguageModelToolInvocationPrepareOptions<Record<string, never>>,
        _token: vscode.CancellationToken
    ) {
        return {
            invocationMessage: 'Getting tasks from Kanban board'
        };
    }

    async invoke(
        _options: vscode.LanguageModelToolInvocationOptions<Record<string, never>>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        try {
            const tasks = this.taskManager.getTasks();

            if (tasks.length === 0) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart('The Kanban board is empty. No tasks found.')
                ]);
            }

            const tasksByStatus = {
                ready: tasks.filter(t => t.status === 'ready'),
                in_progress: tasks.filter(t => t.status === 'in_progress'),
                in_review: tasks.filter(t => t.status === 'in_review'),
                done: tasks.filter(t => t.status === 'done')
            };

            const taskList = tasks
                .sort((a, b) => a.order - b.order)
                .map(t => `- [${t.status}] ${t.title} (ID: ${t.id}, order: ${t.order})`)
                .join('\n');

            const summary = `Found ${tasks.length} task(s):\n` +
                `Ready: ${tasksByStatus.ready.length}, ` +
                `In Progress: ${tasksByStatus.in_progress.length}, ` +
                `In Review: ${tasksByStatus.in_review.length}, ` +
                `Done: ${tasksByStatus.done.length}\n\n${taskList}`;

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(summary)
            ]);
        } catch (error) {
            throw new Error(`Failed to get tasks: ${error}`);
        }
    }
}

/**
 * Language Model Tool: Reset Board
 */
export class ResetBoardTool implements vscode.LanguageModelTool<Record<string, never>> {
    constructor(private taskManager: TaskStateManager) { }

    async prepareInvocation(
        _options: vscode.LanguageModelToolInvocationPrepareOptions<Record<string, never>>,
        _token: vscode.CancellationToken
    ) {
        const tasks = this.taskManager.getTasks();

        return {
            invocationMessage: 'Clearing Kanban board',
            confirmationMessages: {
                title: 'Reset Kanban Board',
                message: new vscode.MarkdownString(
                    `Clear all ${tasks.length} task(s) from the Kanban board?`
                )
            }
        };
    }

    async invoke(
        _options: vscode.LanguageModelToolInvocationOptions<Record<string, never>>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        try {
            const taskCount = this.taskManager.getTasks().length;
            this.taskManager.resetBoard();

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    `Kanban board cleared. Removed ${taskCount} task(s).`
                )
            ]);
        } catch (error) {
            throw new Error(`Failed to reset board: ${error}`);
        }
    }
}
