import { useState, useEffect } from "react";
import { Task } from "./model";
import InputField from "./components/InputField";
import TaskList from "./components/TaskList";
import DayTransitionModal from "./components/DayTransitionModal";
import SettingsModal from "./components/SettingsModal";
import { setLocalStorage, getLocalStorage } from "./utils/localStorage";
import { useDayCheck } from "./hooks/useDayCheck";
import { useSettings } from "./hooks/useSettings";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Toast from "./components/Toast";
import { RiSettings3Line } from "react-icons/ri";

const App: React.FC = () => {
  const [task, setTask] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [allTask, setAllTask] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const { settings, updateSetting } = useSettings();
  const { showTransition, dayGap, lastSeenDayKey, dismissTransition } = useDayCheck(settings.dayBoundaryMinutes);
  const [showSettings, setShowSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCount = allTask.filter((t) => !t.isFocused && !t.isCarriedOver).length;
  const focusedCount = allTask.filter((t) => t.isFocused).length;
  const carriedOverCount = allTask.filter((t) => t.isCarriedOver).length;
  const isFocusAtLimit = focusedCount >= settings.maxFocused;

  const handleReviewComplete = (newActive: Task[]) => {
    setAllTask(
      newActive.map((t) => ({ ...t, isFocused: false, isCarriedOver: false }))
    );
    setCompletedTasks([]);
    dismissTransition();
  };

  const handleAddTask = (e: React.FormEvent, isFocused: boolean = false) => {
    e.preventDefault();
    if (!isFocused && activeCount >= settings.maxActive) return;
    if (task) {
      setAllTask([
        ...allTask,
        {
          id: Date.now(),
          task: task,
          description: description.trim() || undefined,
          isCompleted: false,
          isFocused: isFocused || undefined,
        },
      ]);
      setTask("");
      setDescription("");
    }
  };

  const handleFocus = (id: number) => {
    if (focusedCount >= settings.maxFocused) {
      setToastMessage("Focus limit reached — complete a focused task first");
      return;
    }
    setAllTask((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFocused: true, isCarriedOver: false } : t))
    );
  };

  const handleUnfocus = (id: number) => {
    if (activeCount >= settings.maxActive) {
      setToastMessage("Active task limit reached — complete or remove a task first");
      return;
    }
    setAllTask((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFocused: false } : t))
    );
  };

  const handleComplete = (id: number) => {
    const taskToMove = allTask.find((t) => t.id === id);
    if (taskToMove) {
      setAllTask((prev) => prev.filter((t) => t.id !== id));
      setCompletedTasks((prev) => [
        ...prev,
        { ...taskToMove, isCompleted: true, isFocused: false, isCarriedOver: false },
      ]);
    }
  };

  const handleUncomplete = (id: number) => {
    if (activeCount >= settings.maxActive) {
      setToastMessage("Active task limit reached — complete or remove a task first");
      return;
    }
    const taskToMove = completedTasks.find((t) => t.id === id);
    if (taskToMove) {
      setCompletedTasks((prev) => prev.filter((t) => t.id !== id));
      setAllTask((prev) => [
        ...prev,
        { ...taskToMove, isCompleted: false, isFocused: false, isCarriedOver: false },
      ]);
    }
  };

  const handleDelete = (id: number, fromCompleted?: boolean) => {
    if (fromCompleted) {
      setCompletedTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      setAllTask((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleCarryOver = (id: number) => {
    if (carriedOverCount >= settings.maxCarriedOver) {
      setToastMessage("Carried-over limit reached — complete or remove a carried-over task first");
      return;
    }
    setAllTask((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCarriedOver: true, isFocused: false } : t
      )
    );
  };

  const handleRestore = (id: number) => {
    if (activeCount >= settings.maxActive) {
      setToastMessage("Active task limit reached — complete or remove a task first");
      return;
    }
    setAllTask((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCarriedOver: false } : t
      )
    );
  };

  const handleEdit = (id: number, newTask: string, newDescription?: string) => {
    setAllTask((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, task: newTask, description: newDescription }
          : t
      )
    );
  };

  const handleEditCompleted = (id: number, newTask: string, newDescription?: string) => {
    setCompletedTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, task: newTask, description: newDescription }
          : t
      )
    );
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (
      destination.droppableId === "AllTasksList" &&
      source.droppableId !== "AllTasksList" &&
      activeCount >= settings.maxActive
    ) {
      setToastMessage("Active task limit reached — complete or remove a task first");
      return;
    }

    if (
      destination.droppableId === "CarriedOverList" &&
      source.droppableId !== "CarriedOverList" &&
      carriedOverCount >= settings.maxCarriedOver
    ) {
      setToastMessage("Carried-over limit reached — complete or remove a carried-over task first");
      return;
    }

    const activeTasks = allTask.filter((t) => !t.isFocused && !t.isCarriedOver);
    const focusedTasks = allTask.filter((t) => t.isFocused && !t.isCarriedOver);
    const carriedOver = allTask.filter((t) => t.isCarriedOver);

    let movedTask: Task;
    const active = [...activeTasks];
    const carried = [...carriedOver];
    const complete = [...completedTasks];

    if (source.droppableId === "AllTasksList") {
      movedTask = active.splice(source.index, 1)[0];
    } else if (source.droppableId === "CarriedOverList") {
      movedTask = carried.splice(source.index, 1)[0];
    } else {
      movedTask = complete.splice(source.index, 1)[0];
    }

    if (destination.droppableId === "AllTasksList") {
      active.splice(destination.index, 0, {
        ...movedTask,
        isCompleted: false,
        isFocused: false,
        isCarriedOver: false,
      });
    } else if (destination.droppableId === "CarriedOverList") {
      carried.splice(destination.index, 0, {
        ...movedTask,
        isCompleted: false,
        isFocused: false,
        isCarriedOver: true,
      });
    } else {
      complete.splice(destination.index, 0, {
        ...movedTask,
        isCompleted: true,
        isFocused: false,
        isCarriedOver: false,
      });
    }

    setCompletedTasks(complete);
    setAllTask([...focusedTasks, ...active, ...carried]);
  };

  useEffect(() => {
    const storedTask = getLocalStorage<Task[]>("allTask");
    if (storedTask) {
      setAllTask(storedTask);
    }
    const storedCompleted = getLocalStorage<Task[]>("completedTasks");
    if (storedCompleted) {
      setCompletedTasks(storedCompleted);
    }
  }, []);

  useEffect(() => {
    setLocalStorage("allTask", allTask);
    setLocalStorage("completedTasks", completedTasks);
  }, [allTask, completedTasks]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        {showTransition && (
          <DayTransitionModal
            dayGap={dayGap}
            lastSeenDayKey={lastSeenDayKey}
            allTask={allTask}
            completedTasks={completedTasks}
            onDismiss={dismissTransition}
            onReviewComplete={handleReviewComplete}
            maxCarriedOver={settings.maxCarriedOver}
          />
        )}
        <div className="header">
          <h1 className="heading">TodayTask</h1>
          <button
            className="settings-trigger"
            onClick={() => setShowSettings(true)}
            data-tooltip="Settings"
          >
            <RiSettings3Line />
          </button>
        </div>
        {showSettings && (
          <SettingsModal
            settings={settings}
            onUpdateSetting={updateSetting}
            onClose={() => setShowSettings(false)}
          />
        )}
        <InputField
          task={task}
          setTask={setTask}
          description={description}
          setDescription={setDescription}
          handleAddTask={handleAddTask}
          isAtLimit={activeCount >= settings.maxActive}
          isFocusAtLimit={isFocusAtLimit}
          onShowToast={setToastMessage}
        />
        <TaskList
          allTask={allTask}
          setAllTask={setAllTask}
          completedTasks={completedTasks}
          setCompletedTasks={setCompletedTasks}
          onFocus={handleFocus}
          onUnfocus={handleUnfocus}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onCarryOver={handleCarryOver}
          onRestore={handleRestore}
          onEdit={handleEdit}
          onEditCompleted={handleEditCompleted}
          onUncomplete={handleUncomplete}
        />
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      </div>
    </DragDropContext>
  );
};
export default App;
