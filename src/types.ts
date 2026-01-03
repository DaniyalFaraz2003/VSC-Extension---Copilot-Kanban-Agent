/**
 * Task status enum matching the Kanban columns
 */
export type TaskStatus = 'ready' | 'in_progress' | 'in_review' | 'done';

/**
 * Task model - MUST match exactly as specified
 * No additional fields allowed
 */
export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    order: number;
    createdBy: 'agent';
}

/**
 * Input for creating new tasks
 */
export interface CreateTaskInput {
    title: string;
    order: number;
}

/**
 * Message types for WebView communication
 */
export interface WebViewMessage {
    type: 'update' | 'init';
    tasks?: Task[];
}

export interface ExtensionMessage {
    type: 'ready';
}
