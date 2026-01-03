# Copilot Kanban

A VS Code extension which allows a visual kanban board to be integrated with the github copilot agent chat. This allows for real time task creation by the agent, updation and completion all while you observing what the agent is doing.

## How It Works

When you use Copilot Chat, it can automatically create and update tasks on a Kanban board to show you what it's working on.

## Testing with Copilot Chat

### Step 1: Launch Extension
1. Press **F5** in VS Code
2. Extension Development Host window will open

### Step 2: Enable the Tools
1. Open Copilot Chat (click chat icon or `Ctrl+Alt+I`)
2. Click the **tools icon** (checklist) in the chat input
3. You should see 4 Kanban tools:
   - `kanban_create` - Create tasks
   - `kanban_update` - Update task status
   - `kanban_get` - Get tasks
   - `kanban_reset` - Reset board
4. Make sure they are **enabled** (checked)

### Step 3: Ask Copilot to Use the Board
Try these prompts in Copilot Chat:

**Start a new task list:**
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

**View the board:**
```
Show the kanban board
```
Then use Command Palette: `Copilot Kanban: Show Agent Kanban Board`

## What You'll See

✅ Board opens as an **editor tab** 
✅ Tasks appear in 4 columns: Ready → In Progress → In Review → Done  
✅ Only one task can be "In Progress" at a time  
✅ Tasks persist in `.vscode/kanban-agent.json`  
✅ Copilot can create/update tasks as it works

## Manual Testing

You can also manually invoke commands in Debug Console:

```javascript
// Create tasks
vscode.commands.executeCommand('copilot-kanban.createTasks', [
  { title: 'Set up database', order: 1 },
  { title: 'Create API', order: 2 }
]);

// Show board
vscode.commands.executeCommand('copilot-kanban.showBoard');

// Get tasks
vscode.commands.executeCommand('copilot-kanban.getTasks').then(console.log);
```

## Requirements

- VS Code 1.107.0 or higher
- Copilot Chat subscription (for tool integration)

## License

MIT
