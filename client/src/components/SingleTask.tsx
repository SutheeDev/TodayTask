import { useState, useRef, useEffect } from "react";
import { Task } from "../model";
import { RiCheckLine, RiEditBoxLine, RiDeleteBinLine } from "react-icons/ri";
import { Draggable } from "react-beautiful-dnd";

interface Props {
  task: Task;
  allTask: Task[];
  setAllTask: React.Dispatch<React.SetStateAction<Task[]>>;
  index: number;
}

const SingleTask: React.FC<Props> = ({ task, allTask, setAllTask, index }) => {
  const [isEditing, setIsEditing] = useState<boolean>();
  const [editTask, setEditTask] = useState<string>(task.task);

  const inputRef = useRef<HTMLFormElement>(null);

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

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setAllTask(
      allTask.map((oneTask) =>
        oneTask.id === id ? { ...oneTask, task: editTask } : oneTask
      )
    );
    setIsEditing(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing]);

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <form
          className="single__task"
          onSubmit={(e) => handleEdit(e, task.id)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={editTask}
              className="single__task--text edit__input"
              onChange={(e) => setEditTask(e.target.value)}
            />
          ) : task.isCompleted ? (
            <s className="single__task--text">{task.task}</s>
          ) : (
            <span className="single__task--text">{task.task}</span>
          )}
          <div className="icons">
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
      )}
    </Draggable>
  );
};
export default SingleTask;
