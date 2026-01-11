# Copilot Kanban

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/vscode-marketplace/v/DaniyalFaraz.copilot-kanban)](https://marketplace.visualstudio.com/items?itemName=DaniyalFaraz.copilot-kanban)
[![VS Code](https://img.shields.io/badge/VS_Code-1.107.0%2B-blue)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

A VS Code extension that provides a visual Kanban board integrated with GitHub Copilot Chat. The extension exposes a set of tools to the AI agent, allowing it to create, track, and update tasks in real-time while you observe what's being done.

## 🌟 Features

- **Real-time Task Visualization**: Watch Copilot create and update tasks live on a Kanban board
- **Four-Column Workflow**: Tasks flow through Ready → In Progress → In Review → Done
- **AI-Powered Task Management**: Copilot can automatically create task lists and update their status
- **Persistent Task Storage**: Tasks are saved to `.vscode/kanban-agent.json` in your workspace
- **Visual Progress Tracking**: Only one task can be "In Progress" at a time, ensuring focused execution
- **Command Palette Integration**: Quick access to all Kanban commands
- **Live Board Updates**: The board updates automatically as the agent works

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe development |
| **VS Code Extension API** | Extension development framework |
| **VS Code Language Model API** | Copilot Chat tool integration |
| **WebView API** | Custom Kanban board UI |
| **Node.js** | Runtime environment |
| **ESLint** | Code linting |
| **Mocha** | Testing framework |

## 📋 Requirements

- **VS Code** 1.107.0 or higher
- **GitHub Copilot Chat** subscription (for tool integration)

## 🚀 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Copilot Kanban"
4. Click Install

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DaniyalFaraz2003/VSC-Extension---Copilot-Kanban-Agent.git
   cd copilot-kanban
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the extension:
   ```bash
   npm run compile
   ```

4. Package the extension:
   ```bash
   npm run vscode:prepublish
   ```

5. Install the `.vsix` file using the "Install from VSIX" command in VS Code

## 👨‍💻 Development Setup

### Prerequisites

- Node.js (version 22.x recommended)
- Git
- VS Code

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DaniyalFaraz2003/VSC-Extension---Copilot-Kanban-Agent.git
   cd copilot-kanban
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Open the project in VS Code**:
   ```bash
   code .
   ```

4. **Run the extension in debug mode**:
   - Press `F5` or go to Run → Start Debugging
   - A new VS Code window (Extension Development Host) will open

5. **Make changes**:
   - Edit the TypeScript files in the `src/` directory
   - The extension will automatically recompile using `tsc -watch`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile TypeScript to JavaScript |
| `npm run watch` | Watch for changes and recompile automatically |
| `npm run lint` | Run ESLint to check code quality |
| `npm run test` | Run the test suite |
| `npm run vscode:prepublish` | Prepare extension for publishing |

### Project Structure

```
copilot-kanban/
├── src/
│   ├── extension.ts              # Main extension entry point
│   ├── languageModelTools.ts     # Copilot Chat tool implementations
│   ├── kanbanViewProvider.ts     # WebView UI for the Kanban board
│   ├── taskStateManager.ts       # Task state management and persistence
│   ├── types.ts                  # TypeScript type definitions
│   └── test/
│       └── extension.test.ts     # Extension tests
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # This file
└── CHANGELOG.md                  # Version changelog
```

## 💡 Usage

### Viewing the Kanban Board

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Show Agent Kanban Board"
3. The board will open as an editor tab

### Using with Copilot Chat

#### Step 1: Launch Extension
1. Press `F5` in VS Code (or use the packaged extension)
2. Extension Development Host window will open

#### Step 2: Enable the Tools
1. Open Copilot Chat (click chat icon or `Ctrl+Alt+I`)
2. Click the tools icon (checklist) in the chat input
3. Enable the following Kanban tools:
   - `kanban_create` - Create tasks
   - `kanban_update` - Update task status
   - `kanban_get` - Get tasks
   - `kanban_reset` - Reset board

#### Step 3: Ask Copilot to Use the Board

**Create a task list:**
```
@workspace Using the kanban tools, create a task list for building a REST API with user authentication
```

**Update task progress:**
```
Using kanban_get to see tasks, then update the first task to in_progress
```

**Check task status:**
```
Show me all tasks on the kanban board
```

**Clear the board:**
```
Clear the kanban board to start fresh
```

### Using Commands Directly

You can also invoke commands from the Command Palette:

| Command | Action |
|---------|--------|
| `Copilot Kanban: Show Agent Kanban Board` | Opens the board |
| `Copilot Kanban: Create Tasks` | Create new tasks (programmatic) |
| `Copilot Kanban: Set Task Status` | Update task status (programmatic) |
| `Copilot Kanban: Reset Agent Kanban Board` | Clear all tasks |
| `Copilot Kanban: Get Tasks` | Retrieve task list (programmatic) |

## 🏗 Architecture

### Core Components

1. **TaskStateManager** (`taskStateManager.ts`)
   - Single source of truth for task state
   - Enforces business rules (e.g., one task in progress at a time)
   - Handles persistence to `.vscode/kanban-agent.json`
   - Emits events when tasks change

2. **KanbanViewProvider** (`kanbanViewProvider.ts`)
   - Manages the WebView panel
   - Renders the HTML/CSS/JS for the board
   - Handles message passing between extension and WebView
   - Updates the UI in real-time

3. **Language Model Tools** (`languageModelTools.ts`)
   - Implements tools for Copilot Chat integration:
     - `CreateTasksTool` - Create tasks on the board
     - `UpdateTaskStatusTool` - Move tasks between columns
     - `GetTasksTool` - Retrieve all tasks
     - `ResetBoardTool` - Clear the board

4. **Extension Entry Point** (`extension.ts`)
   - Initializes all components
   - Registers commands
   - Registers Language Model Tools with VS Code

### Data Flow

```
Copilot Chat
    ↓ (invokes tool)
Language Model Tool
    ↓ (calls API)
TaskStateManager
    ↓ (emits event)
KanbanViewProvider
    ↓ (updates WebView)
User Interface
```

### Task Model

```typescript
interface Task {
    id: string;           // Unique identifier
    title: string;        // Task description
    status: TaskStatus;   // 'ready' | 'in_progress' | 'in_review' | 'done'
    order: number;        // Execution order
    createdBy: 'agent';   // Who created the task
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get involved.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [VS Code Extension API](https://code.visualstudio.com/api)
- Integrates with [GitHub Copilot](https://github.com/features/copilot)
- Inspired by modern Kanban productivity tools

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/DaniyalFaraz2003/VSC-Extension---Copilot-Kanban-Agent/issues)
- **VS Code Marketplace**: [Rate and review](https://marketplace.visualstudio.com/items?itemName=DaniyalFaraz.copilot-kanban)

## 📊 Roadmap

- [ ] Drag-and-drop task management
- [ ] Custom task colors and labels
- [ ] Task descriptions and subtasks
- [ ] Keyboard shortcuts for task navigation
- [ ] Export tasks to markdown
- [ ] Multi-workspace support
- [ ] Custom column configurations

---

**Made with ❤️ by Daniyal Faraz**
