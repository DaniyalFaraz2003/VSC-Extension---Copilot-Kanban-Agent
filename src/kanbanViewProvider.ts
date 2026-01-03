import * as vscode from 'vscode';
import { TaskStateManager } from './taskStateManager';
import { Task } from './types';

/**
 * KanbanViewProvider - Manages the WebView Panel that displays the Kanban board
 * 
 * Responsibilities:
 * - Create and manage the WebView panel in the main editor area
 * - Send task updates to the WebView
 * - Generate the HTML/CSS/JS for the UI
 * - Handle message passing between extension and WebView
 */
export class KanbanViewProvider {
    private static currentPanel?: vscode.WebviewPanel;

    constructor(
        private readonly extensionUri: vscode.Uri,
        private readonly taskManager: TaskStateManager
    ) {
        // Listen to task changes and update WebView
        taskManager.onDidChange(() => {
            this.updateWebView();
        });
    }

    /**
     * Show the Kanban board in the main editor area
     */
    public show(): void {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : vscode.ViewColumn.One;

        // If panel already exists, reveal it
        if (KanbanViewProvider.currentPanel) {
            KanbanViewProvider.currentPanel.reveal(column);
            this.updateWebView();
            return;
        }

        // Create new panel
        const panel = vscode.window.createWebviewPanel(
            'copilotKanban',
            'Agent Kanban',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [this.extensionUri],
                retainContextWhenHidden: true
            }
        );

        KanbanViewProvider.currentPanel = panel;

        panel.webview.html = this.getHtmlContent(panel.webview);

        // Handle messages from WebView
        panel.webview.onDidReceiveMessage(message => {
            switch (message.type) {
                case 'ready':
                    this.updateWebView();
                    break;
            }
        });

        // Reset when panel is closed
        panel.onDidDispose(() => {
            KanbanViewProvider.currentPanel = undefined;
        });

        // Send initial state
        this.updateWebView();
    }

    /**
     * Send updated task list to WebView
     */
    private updateWebView(): void {
        if (KanbanViewProvider.currentPanel) {
            KanbanViewProvider.currentPanel.webview.postMessage({
                type: 'update',
                tasks: this.taskManager.getTasks()
            });
        }
    }

    /**
     * Generate the complete HTML for the Kanban board UI
     */
    private getHtmlContent(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agent Kanban Board</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 16px;
            overflow-x: auto;
        }

        .board {
            display: flex;
            gap: 16px;
            min-width: fit-content;
        }

        .column {
            flex: 1;
            min-width: 250px;
            background-color: var(--vscode-sideBar-background);
            border-radius: 8px;
            padding: 12px;
        }

        .column-header {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--vscode-panel-border);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .column-count {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            border-radius: 10px;
            padding: 2px 8px;
            font-size: 11px;
            font-weight: 500;
        }

        .task-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-height: 100px;
        }

        .task {
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            padding: 12px;
            transition: all 0.2s ease;
            position: relative;
        }

        .task:hover {
            border-color: var(--vscode-focusBorder);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .task-title {
            font-size: 13px;
            line-height: 1.4;
            margin-bottom: 8px;
        }

        .task-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
        }

        .task-order {
            background-color: var(--vscode-input-background);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
        }

        .task-agent {
            opacity: 0.7;
        }

        /* In-progress task gets a special style */
        .task.in-progress {
            border-color: var(--vscode-progressBar-background);
            border-width: 2px;
        }

        .task.in-progress::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(
                90deg,
                var(--vscode-progressBar-background) 0%,
                var(--vscode-progressBar-background) 50%,
                transparent 50%,
                transparent 100%
            );
            background-size: 20px 100%;
            animation: progress 1s linear infinite;
        }

        @keyframes progress {
            0% {
                background-position: 0 0;
            }
            100% {
                background-position: 20px 0;
            }
        }

        .empty-state {
            text-align: center;
            padding: 32px 16px;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
        }

        .header {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .header-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .header-subtitle {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-title">Agent Execution Board</div>
        <div class="header-subtitle">Live visualization of AI agent task execution</div>
    </div>
    
    <div class="board">
        <div class="column">
            <div class="column-header">
                <span>Ready</span>
                <span class="column-count" id="ready-count">0</span>
            </div>
            <div class="task-list" id="ready-tasks"></div>
        </div>

        <div class="column">
            <div class="column-header">
                <span>In Progress</span>
                <span class="column-count" id="in_progress-count">0</span>
            </div>
            <div class="task-list" id="in_progress-tasks"></div>
        </div>

        <div class="column">
            <div class="column-header">
                <span>In Review</span>
                <span class="column-count" id="in_review-count">0</span>
            </div>
            <div class="task-list" id="in_review-tasks"></div>
        </div>

        <div class="column">
            <div class="column-header">
                <span>Done</span>
                <span class="column-count" id="done-count">0</span>
            </div>
            <div class="task-list" id="done-tasks"></div>
        </div>
    </div>

    <script>
        (function() {
            const vscode = acquireVsCodeApi();
            
            // Notify extension that WebView is ready
            vscode.postMessage({ type: 'ready' });

            // Listen for task updates from extension
            window.addEventListener('message', event => {
                const message = event.data;
                
                if (message.type === 'update' || message.type === 'init') {
                    renderTasks(message.tasks || []);
                }
            });

            /**
             * Render all tasks to their respective columns
             */
            function renderTasks(tasks) {
                // Group tasks by status
                const tasksByStatus = {
                    ready: [],
                    in_progress: [],
                    in_review: [],
                    done: []
                };

                tasks.forEach(task => {
                    if (tasksByStatus[task.status]) {
                        tasksByStatus[task.status].push(task);
                    }
                });

                // Render each column
                Object.keys(tasksByStatus).forEach(status => {
                    const tasksInColumn = tasksByStatus[status];
                    const container = document.getElementById(status + '-tasks');
                    const countElement = document.getElementById(status + '-count');
                    
                    if (!container || !countElement) return;

                    // Update count
                    countElement.textContent = tasksInColumn.length;

                    // Clear and render tasks
                    container.innerHTML = '';
                    
                    if (tasksInColumn.length === 0) {
                        container.innerHTML = '<div class="empty-state">No tasks</div>';
                    } else {
                        // Sort by order
                        tasksInColumn.sort((a, b) => a.order - b.order);
                        
                        tasksInColumn.forEach(task => {
                            const taskEl = createTaskElement(task);
                            container.appendChild(taskEl);
                        });
                    }
                });
            }

            /**
             * Create DOM element for a single task
             */
            function createTaskElement(task) {
                const div = document.createElement('div');
                div.className = 'task';
                if (task.status === 'in_progress') {
                    div.classList.add('in-progress');
                }
                
                div.innerHTML = \`
                    <div class="task-title">\${escapeHtml(task.title)}</div>
                    <div class="task-meta">
                        <span class="task-order">#\${task.order}</span>
                        <span class="task-agent">🤖 agent</span>
                    </div>
                \`;
                
                return div;
            }

            /**
             * Escape HTML to prevent XSS
             */
            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }
        })();
    </script>
</body>
</html>`;
    }
}
