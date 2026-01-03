import * as vscode from 'vscode';
import { TaskStateManager } from './taskStateManager';
import { KanbanViewProvider } from './kanbanViewProvider';
import { CreateTaskInput, TaskStatus } from './types';
import { CreateTasksTool, UpdateTaskStatusTool, GetTasksTool, ResetBoardTool } from './languageModelTools';

/**
 * Global instance of the task state manager
 * This provides the single source of truth for all task state
 */
let taskManager: TaskStateManager;
let kanbanProvider: KanbanViewProvider;

/**
 * Extension activation
 * 
 * Sets up:
 * 1. Task state manager
 * 2. WebView panel provider
 * 3. Commands that Copilot Chat can invoke
 * 4. Language Model Tools for Copilot integration
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Copilot Kanban extension is activating...');

	// Get workspace root
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		vscode.window.showErrorMessage('Copilot Kanban requires an open workspace');
		return;
	}

	const workspaceRoot = workspaceFolders[0].uri.fsPath;

	// Initialize task state manager
	taskManager = new TaskStateManager(workspaceRoot);

	// Initialize Kanban view provider
	kanbanProvider = new KanbanViewProvider(context.extensionUri, taskManager);

	// Register command to show Kanban board in main editor area
	const showBoardCommand = vscode.commands.registerCommand(
		'copilot-kanban.showBoard',
		() => {
			kanbanProvider.show();
		}
	);
	context.subscriptions.push(showBoardCommand);

	// ===================================================================
	// Commands for Copilot Chat to invoke
	// ===================================================================

	// Command: Create tasks
	const createTasksCommand = vscode.commands.registerCommand(
		'copilot-kanban.createTasks',
		(tasks: CreateTaskInput[]) => {
			taskManager.createTasks(tasks);
			vscode.window.showInformationMessage(`Created ${tasks.length} task(s)`);
		}
	);
	context.subscriptions.push(createTasksCommand);

	// Command: Set task status
	const setTaskStatusCommand = vscode.commands.registerCommand(
		'copilot-kanban.setTaskStatus',
		(taskId: string, status: TaskStatus) => {
			try {
				taskManager.setTaskStatus(taskId, status);
			} catch (error) {
				vscode.window.showErrorMessage(`Error: ${error}`);
			}
		}
	);
	context.subscriptions.push(setTaskStatusCommand);

	// Command: Reset board
	const resetBoardCommand = vscode.commands.registerCommand(
		'copilot-kanban.resetBoard',
		() => {
			taskManager.resetBoard();
			vscode.window.showInformationMessage('Kanban board reset');
		}
	);
	context.subscriptions.push(resetBoardCommand);

	// Command: Get tasks (returns tasks for programmatic use)
	const getTasksCommand = vscode.commands.registerCommand(
		'copilot-kanban.getTasks',
		() => {
			return taskManager.getTasks();
		}
	);
	context.subscriptions.push(getTasksCommand);

	// ===================================================================
	// Language Model Tools - Copilot can discover and invoke these
	// ===================================================================

	// Register tools with the Language Model API
	context.subscriptions.push(
		vscode.lm.registerTool('copilot-kanban_create_tasks', new CreateTasksTool(taskManager))
	);

	context.subscriptions.push(
		vscode.lm.registerTool('copilot-kanban_update_task', new UpdateTaskStatusTool(taskManager))
	);

	context.subscriptions.push(
		vscode.lm.registerTool('copilot-kanban_get_tasks', new GetTasksTool(taskManager))
	);

	context.subscriptions.push(
		vscode.lm.registerTool('copilot-kanban_reset_board', new ResetBoardTool(taskManager))
	);

	console.log('Copilot Kanban extension is now active with Language Model Tools registered');
}

/**
 * Extension deactivation
 */
export function deactivate() {
	// Cleanup if needed
}
