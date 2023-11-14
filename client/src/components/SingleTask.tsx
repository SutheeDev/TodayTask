import { Task } from "../model";
import { RiCheckLine, RiEditBoxLine, RiDeleteBinLine } from "react-icons/ri";

interface Props {
  task: Task;
  allTask: Task[];
  setAllTask: React.Dispatch<React.SetStateAction<Task[]>>;
}

const SingleTask: React.FC<Props> = ({ task, allTask, setAllTask }) => {
  const handleComplete = (id: number) => {
    setAllTask(
      allTask.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  return (
    <form className="single__task">
      <span className="single__task--text">{task.task}</span>
      <div>
        <span className="icon" onClick={() => handleComplete(task.id)}>
          <RiCheckLine />
        </span>
        <span className="icon">
          <RiEditBoxLine />
        </span>
        <span className="icon">
          <RiDeleteBinLine />
        </span>
      </div>
    </form>
  );
};
export default SingleTask;
