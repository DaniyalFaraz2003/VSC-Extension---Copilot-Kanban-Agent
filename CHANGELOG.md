# Change Log

All notable changes to the "copilot-kanban" extension will be documented in this file.

## [0.0.1] - 2026-01-03

### Added
- Initial release of Copilot Kanban extension
- Visual Kanban board with 4 columns (Ready, In Progress, In Review, Done)
- Agent API for task management:
  - `createTasks()` - Create multiple tasks
  - `setTaskStatus()` - Move tasks between columns  
  - `resetBoard()` - Clear all tasks
  - `getTasks()` - Get current task list
- Task state persistence to `.vscode/kanban-agent.json`
- WebView UI with live task updates
- Activity bar icon for quick access
- Command palette commands:
  - "Show Agent Kanban Board"
  - "Reset Agent Kanban Board"
- Enforces one-task-in-progress-at-a-time rule
- Animated visual indicator for in-progress tasks
- Example agent integration patterns

### Design Principles
- Agent-owned, deterministic task board
- Simple, observable execution visualization
- No user task editing (agent controls all state)
- Persistent across VS Code sessions