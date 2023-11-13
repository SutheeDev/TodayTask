import { Task } from "../model";
import SingleTask from "./SingleTask";

interface Props {
  allTask: Task[];
  setAllTask: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskList: React.FC<Props> = ({ allTask, setAllTask }) => {
  return (
    <div className="tasks">
      {allTask.map((eachTask) => (
        // <li>{eachTask.task}</li>
        <SingleTask
          key={eachTask.id}
          task={eachTask}
          allTask={allTask}
          setAllTask={setAllTask}
        />
      ))}
    </div>
  );
};
export default TaskList;
