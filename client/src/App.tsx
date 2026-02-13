import { useState, useEffect } from "react";
import { Task } from "./model";
import InputField from "./components/InputField";
import TaskList from "./components/TaskList";
import DayTransitionModal from "./components/DayTransitionModal";
import { setLocalStorage, getLocalStorage } from "./utils/localStorage";
import { useDayCheck } from "./hooks/useDayCheck";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const MAX_FOCUSED = 3;

const App: React.FC = () => {
  const [task, setTask] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [allTask, setAllTask] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const { showTransition, dayGap, lastSeenDayKey, dismissTransition } = useDayCheck();

  const handleReviewComplete = (newActive: Task[]) => {
    setAllTask(
      newActive.map((t) => ({ ...t, isFocused: false, isCarriedOver: false }))
    );
    dismissTransition();
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      setAllTask([
        ...allTask,
        {
          id: Date.now(),
          task: task,
          description: description.trim() || undefined,
          isCompleted: false,
        },
      ]);
      setTask("");
      setDescription("");
    }
  };

  const handleFocus = (id: number) => {
    const focusedCount = allTask.filter((t) => t.isFocused).length;
    if (focusedCount >= MAX_FOCUSED) return;
    setAllTask((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFocused: true } : t))
    );
  };

  const handleUnfocus = (id: number) => {
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

  const handleDelete = (id: number, fromCompleted?: boolean) => {
    if (fromCompleted) {
      setCompletedTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      setAllTask((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleAbandon = (id: number) => {
    setAllTask((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCarryOver = (id: number) => {
    setAllTask((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCarriedOver: true, isFocused: false } : t
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

    // Only active (non-focused, non-carried-over) tasks are draggable
    const activeTasks = allTask.filter((t) => !t.isFocused && !t.isCarriedOver);
    const otherTasks = allTask.filter((t) => t.isFocused || t.isCarriedOver);

    let movedTask;
    const active = [...activeTasks];
    const complete = [...completedTasks];

    if (source.droppableId === "AllTasksList") {
      movedTask = active.splice(source.index, 1)[0];
    } else {
      movedTask = complete.splice(source.index, 1)[0];
    }

    if (destination.droppableId === "AllTasksList") {
      active.splice(destination.index, 0, { ...movedTask, isCompleted: false });
    } else {
      complete.splice(destination.index, 0, {
        ...movedTask,
        isCompleted: true,
        isFocused: false,
        isCarriedOver: false,
      });
    }

    setCompletedTasks(complete);
    setAllTask([...otherTasks, ...active]);
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
          />
        )}
        <h1 className="heading">TodayTask</h1>
        <InputField
          task={task}
          setTask={setTask}
          description={description}
          setDescription={setDescription}
          handleAddTask={handleAddTask}
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
          onAbandon={handleAbandon}
          onCarryOver={handleCarryOver}
          onEdit={handleEdit}
          onEditCompleted={handleEditCompleted}
        />
      </div>
    </DragDropContext>
  );
};
export default App;
