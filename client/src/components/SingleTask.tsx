import { useState, useRef, useEffect } from "react";
import { Task } from "../model";
import {
  RiCheckLine,
  RiEditBoxLine,
  RiDeleteBinLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import { Draggable } from "react-beautiful-dnd";

interface Props {
  task: Task;
  allTask: Task[];
  setAllTask: React.Dispatch<React.SetStateAction<Task[]>>;
  index: number;
  completedTasks: Task[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const SingleTask: React.FC<Props> = ({
  task,
  allTask,
  setAllTask,
  index,
  setCompletedTasks,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>();
  const [editTask, setEditTask] = useState<string>(task.task);
  const [editDescription, setEditDescription] = useState<string>(
    task.description || ""
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleComplete = (id: number) => {
    const taskToMove = allTask.find((task) => task.id === id);

    if (taskToMove) {
      if (!taskToMove.isCompleted) {
        setAllTask((prev) => prev.filter((t) => t.id !== id));
        setCompletedTasks((prev) => [
          ...prev,
          { ...taskToMove, isCompleted: true },
        ]);
      }
    }
  };

  const handleDelete = (id: number) => {
    setAllTask(allTask.filter((task) => task.id !== id));
  };

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setAllTask(
      allTask.map((oneTask) =>
        oneTask.id === id
          ? {
              ...oneTask,
              task: editTask,
              description: editDescription.trim() || undefined,
            }
          : oneTask
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
            <div className="single__task--content">
              <input
                ref={inputRef}
                value={editTask}
                className="single__task--text edit__input"
                onChange={(e) => setEditTask(e.target.value)}
              />
              <textarea
                className="edit__description"
                placeholder="Add a description (optional)"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
              />
            </div>
          ) : (
            <div className="single__task--content">
              <div className="single__task--title-row">
                {task.isCompleted ? (
                  <s className="single__task--text">{task.task}</s>
                ) : (
                  <span className="single__task--text">{task.task}</span>
                )}
                {task.description && (
                  <span
                    className={`desc-toggle ${isExpanded ? "rotated" : ""}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <RiArrowDownSLine />
                  </span>
                )}
              </div>
              {task.description && isExpanded && (
                <div className="single__task--description">
                  {task.description}
                </div>
              )}
            </div>
          )}
          <div className="icons">
            {!task.isCompleted && (
              <span className="icon" onClick={() => handleComplete(task.id)}>
                <RiCheckLine />
              </span>
            )}
            <span
              className="icon"
              onClick={() => {
                if (!isEditing) {
                  setEditTask(task.task);
                  setEditDescription(task.description || "");
                  setIsEditing(true);
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
