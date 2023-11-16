import { useState } from "react";
import { Task } from "../model";
import { RiCheckLine, RiEditBoxLine, RiDeleteBinLine } from "react-icons/ri";

interface Props {
  task: Task;
  allTask: Task[];
  setAllTask: React.Dispatch<React.SetStateAction<Task[]>>;
}

const SingleTask: React.FC<Props> = ({ task, allTask, setAllTask }) => {
  const [isEditing, setIsEditing] = useState<boolean>();
  const [editTask, setEditTask] = useState<string>(task.task);

  const handleComplete = (id: number) => {
    setAllTask(
      allTask.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const handleDelete = (id: number) => {
    setAllTask(allTask.filter((task) => task.id !== id));
  };

  return (
    <form className="single__task">
      {isEditing ? (
        <input
          value={editTask}
          className="single__task--text edit__input"
          onChange={(e) => setEditTask(e.target.value)}
        />
      ) : task.isCompleted ? (
        <s className="single__task--text">{task.task}</s>
      ) : (
        <span className="single__task--text">{task.task}</span>
      )}
      <div>
        <span className="icon" onClick={() => handleComplete(task.id)}>
          <RiCheckLine />
        </span>
        <span
          className="icon"
          onClick={() => {
            if (!isEditing && !task.isCompleted) {
              setIsEditing(!isEditing);
            }
          }}
        >
          <RiEditBoxLine />
        </span>
        <span className="icon" onClick={() => handleDelete(task.id)}>
          <RiDeleteBinLine />
        </span>
      </div>
    </form>
  );
};
export default SingleTask;
