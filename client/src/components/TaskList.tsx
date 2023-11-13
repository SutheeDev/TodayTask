import { Task } from "../model";

interface Props {
  allTask: Task[];
  setAllTask: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskList: React.FC<Props> = ({ allTask, setAllTask }) => {
  return (
    <div className="tasks">
      {allTask.map((singleTask) => (
        <li>{singleTask.task}</li>
      ))}
    </div>
  );
};
export default TaskList;
