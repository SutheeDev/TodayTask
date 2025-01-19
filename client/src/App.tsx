import { useState, useEffect } from "react";
import { Task } from "./model";
import InputField from "./components/InputField";
import TaskList from "./components/TaskList";
import { setLocalStorage, getLocalStorage } from "./utils/localStorage";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const App: React.FC = () => {
  const [task, setTask] = useState<string>("");
  const [allTask, setAllTask] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      setAllTask([
        ...allTask,
        {
          id: Date.now(),
          task: task,
          isCompleted: false,
        },
      ]);
      setTask("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let movedTask;
    let active = [...allTask];
    let complete = [...completedTasks];

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
      });
    }

    setCompletedTasks(complete);
    setAllTask(active);
  };

  useEffect(() => {
    const storedTask = getLocalStorage<Task[]>("allTask");
    if (storedTask) {
      setAllTask(storedTask);
    }
  }, []);

  useEffect(() => {
    setLocalStorage("allTask", allTask);
    setLocalStorage("completedTasks", completedTasks);
  }, [allTask, completedTasks]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        <h1 className="heading">TodayTask</h1>
        <InputField
          task={task}
          setTask={setTask}
          handleAddTask={handleAddTask}
        />
        <TaskList
          allTask={allTask}
          setAllTask={setAllTask}
          completedTasks={completedTasks}
          setCompletedTasks={setCompletedTasks}
        />
      </div>
    </DragDropContext>
  );
};
export default App;
