import { useState } from "react";
import InputField from "./components/InputField";

const App: React.FC = () => {
  const [task, setTask] = useState<string>("");

  return (
    <div className="app">
      <h1 className="heading">today task</h1>
      <InputField task={task} setTask={setTask} />
    </div>
  );
};
export default App;
