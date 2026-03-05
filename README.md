# TodayTask

![TodayTask application](https://res.cloudinary.com/dnc7potxo/image/upload/v1772675284/ReadMe-Images/TodayTask/v2_qxmlhl.png)

[TodayTask](https://su-t-today-task.netlify.app/) is a focused daily task manager with a carry-over workflow, focus mode, and day transitions. Everything runs in the browser with no account or backend required.
<br><br>

## Table of Contents

- [Features](#features)
  - [Task Sections](#task-sections)
  - [Adding Tasks](#adding-tasks)
  - [Task Actions](#task-actions)
  - [Drag and Drop](#drag-and-drop)
  - [Day Transition](#day-transition)
  - [Settings](#settings)
  - [Notifications](#notifications)
  - [Persistence](#persistence)
- [Technologies Used](#technologies-used)
- [Feedback](#feedback)
<br><br>

## Features <a name='features'></a>

### Task Sections <a name='task-sections'></a>

The app is organized into four sections:

- **Focus**: pinned tasks for your highest priorities. Not draggable. Limit: 1–3 (configurable, default 3).
- **Active Tasks**: your working list for the day. Limit: 1–10 (configurable, default 7).
- **Carried Over**: tasks brought forward from a previous day. Limit: 1–5 (configurable, default 3), capped at the active task limit.
- **Completed Tasks**: tasks you have finished.

### Adding Tasks <a name='adding-tasks'></a>

Use the input field at the top to add a new task. An optional description field is available for extra detail. A **Quick Focus** button lets you add a task directly into the Focus section without extra steps.

![Description](https://res.cloudinary.com/dnc7potxo/image/upload/v1772675586/ReadMe-Images/TodayTask/Description_lr2ypo.png)

### Task Actions <a name='task-actions'></a>

Each task supports the following actions:

- **Focus / Unfocus**: pin a task to the Focus section (star icon). Unfocusing moves the task back to Active.
- **Complete / Undo**: check off a task to move it to Completed. Click again to move it back to Active.
- **Edit**: inline editing for both the task title and description.
- **Carry Over / Move to Active**: available via the overflow menu on active and carried-over tasks.
- **Delete**: permanently removes the task.

### Drag and Drop <a name='drag-and-drop'></a>

Tasks can be dragged to reorder within a section or moved between Active, Carried Over, and Completed zones. Section limits are enforced on drop, so if a zone is full, the drop is rejected. Focused tasks are fixed and cannot be dragged.

### Day Transition <a name='day-transition'></a>

When you open the app on a new day (based on a configurable day boundary, default 3:00 AM), a modal appears. The behavior depends on how much time has passed and whether you have unfinished tasks:

- **Greeting mode**: no leftover tasks. Shows a motivational message and a "Let's go" button.
- **Review mode** (1–6 days passed, tasks remain): review each task one at a time. For every unfinished task, choose to carry it over, mark it complete, or abandon it. A carry-over counter tracks how many you are keeping. All tasks must be resolved before continuing.
- **Auto-abandon mode** (7+ days passed, tasks remain): all old tasks are cleared automatically. Click "Start fresh" to begin.

### Settings <a name='settings'></a>

Open the settings modal to configure:

| Setting | Range | Default |
|---|---|---|
| Active task limit | 1–10 | 7 |
| Focus task limit | 1–3 | 3 |
| Carried-over limit | 1–5 | 3 |
| Day boundary | 0–360 min after midnight | 180 min (3:00 AM) |

### Notifications <a name='notifications'></a>

Toast messages appear and auto-dismiss when a section limit is violated, for example when drag-and-drop, unfocusing, or restoring a task would exceed the active task limit.

### Persistence <a name='persistence'></a>

All tasks and settings are saved to `localStorage`. No account or network connection is needed.
<br><br>

## Technologies Used <a name='technologies-used'></a>

- React 18
- TypeScript 5
- Vite 4
- react-beautiful-dnd
- react-icons
- CSS (custom properties for theming)
- localStorage (no backend)
- Netlify

## Feedback <a name='feedback'></a>

Found a bug or have a suggestion? Open an issue on [GitHub](https://github.com/SutheeDev/TodayTask).
