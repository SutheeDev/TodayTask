import { useState } from "react";
import { Task } from "./model";
import InputField from "./components/InputField";
import TaskList from "./components/TaskList";
import { DragDropContext } from "react-beautiful-dnd";

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

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="app">
        <h1 className="heading">today task</h1>
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
