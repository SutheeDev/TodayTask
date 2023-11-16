import { Task } from "../model";
import SingleTask from "./SingleTask";

interface Props {
  allTask: Task[];
  setAllTask: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskList: React.FC<Props> = ({ allTask, setAllTask }) => {
  return (
    <div className="container">
      <div className="tasks">
        <span className="allTask__heading">active tasks</span>
        {allTask.map((eachTask) => (
          <SingleTask
            key={eachTask.id}
            task={eachTask}
            allTask={allTask}
            setAllTask={setAllTask}
          />
        ))}
      </div>
      <div className="tasks completed">
        <span className="allTask__heading">completed tasks</span>
        {allTask.map((eachTask) => (
          <SingleTask
            key={eachTask.id}
            task={eachTask}
            allTask={allTask}
            setAllTask={setAllTask}
          />
        ))}
      </div>
    </div>
  );
};
export default TaskList;
