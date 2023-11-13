import { useState } from "react";
import { Task } from "./model";
import InputField from "./components/InputField";

const App: React.FC = () => {
  const [task, setTask] = useState<string>("");
  const [allTask, setAllTask] = useState<Task[]>([]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="app">
      <h1 className="heading">today task</h1>
      <InputField task={task} setTask={setTask} handleAddTask={handleAddTask} />
    </div>
  );
};
export default App;
