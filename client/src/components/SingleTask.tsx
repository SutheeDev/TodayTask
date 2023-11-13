import { Task } from "../model";

interface Props {
  task: Task;
  allTask: [Task];
  setAllTask: React.Dispatch<React.SetStateAction<Task[]>>;
}

const SingleTask: React.FC<Props> = ({ task, allTask, setAllTask }) => {
  return <div>SingleTask</div>;
};
export default SingleTask;
