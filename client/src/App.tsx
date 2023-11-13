import { useState } from "react";
import { Task } from "./model";
import InputField from "./components/InputField";
import TaskList from "./components/TaskList";

const App: React.FC = () => {
  const [task, setTask] = useState<string>("");
  const [allTask, setAllTask] = useState<Task[]>([]);

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
    <div className="app">
      <h1 className="heading">today task</h1>
      <InputField task={task} setTask={setTask} handleAddTask={handleAddTask} />
      {allTask.map((singleTask) => (
        <li>{singleTask.task}</li>
      ))}
    </div>
  );
};
export default App;
