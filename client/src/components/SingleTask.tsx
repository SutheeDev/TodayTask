import { useState, useRef, useEffect } from "react";
import { Task } from "../model";
import {
  RiDraggable,
  RiArrowDownSLine,
  RiEditBoxLine,
  RiDeleteBinLine,
  RiTimeLine,
  RiCloseCircleLine,
} from "react-icons/ri";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";

export type TaskSection = "focused" | "active" | "carried-over" | "completed";

interface Props {
  task: Task;
  index: number;
  section: TaskSection;
  onFocus?: (id: number) => void;
  onUnfocus?: (id: number) => void;
  onComplete?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAbandon?: (id: number) => void;
  onCarryOver?: (id: number) => void;
  onEdit?: (id: number, newTask: string, newDescription?: string) => void;
}

const SingleTask: React.FC<Props> = ({
  task,
  index,
  section,
  onFocus,
  onUnfocus,
  onComplete,
  onDelete,
  onAbandon,
  onCarryOver,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState(task.task);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit?.(task.id, editTask, editDescription.trim() || undefined);
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditTask(task.task);
    setEditDescription(task.description || "");
    setIsExpanded(true);
    setIsEditing(true);
    setMenuOpen(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing, editDescription, isExpanded]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const isFocusedSection = section === "focused";
  const isCompleted = section === "completed";
  const showDragHandle = section === "active" || section === "carried-over";
  const showFocusBtn = !isCompleted;
  const showCompleteBtn = !isCompleted;

  const renderContent = (dragHandleProps?: DraggableProvided["dragHandleProps"]) => (
    <form
      className="single__task"
      onSubmit={handleEditSubmit}
    >
      {/* Drag handle */}
      {showDragHandle && (
        <span className="drag-handle" {...dragHandleProps}>
          <RiDraggable />
        </span>
      )}

      {/* Task content */}
      {isEditing ? (
        <div className="single__task--content">
          <input
            ref={inputRef}
            value={editTask}
            className="single__task--text edit__input"
            onChange={(e) => setEditTask(e.target.value)}
          />
        </div>
      ) : (
        <div className="single__task--content">
          <div className="single__task--title-row">
            {isCompleted ? (
              <s className="single__task--text">{task.task}</s>
            ) : (
              <span className="single__task--text">{task.task}</span>
            )}
            {task.description && (
              <span
                className={`icon desc-toggle ${isExpanded ? "rotated" : ""}`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <RiArrowDownSLine />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="task-actions">
        {isEditing && task.description && (
          <span
            className={`icon desc-toggle ${isExpanded ? "rotated" : ""}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <RiArrowDownSLine />
          </span>
        )}

        {showFocusBtn && (
          <button
            type="button"
            className={`task-btn${isFocusedSection ? " task-btn--focused" : ""}`}
            onClick={() =>
              isFocusedSection
                ? onUnfocus?.(task.id)
                : onFocus?.(task.id)
            }
          >
            Focus
          </button>
        )}

        {showCompleteBtn && (
          <button
            type="button"
            className="task-btn"
            onClick={() => onComplete?.(task.id)}
          >
            Done
          </button>
        )}

        {/* Overflow menu */}
        <div className="overflow-menu-wrapper" ref={menuRef}>
          <button
            type="button"
            className="task-btn overflow-trigger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            &hellip;
          </button>
          {menuOpen && (
            <div className="overflow-menu">
              <button
                type="button"
                className="overflow-menu__item"
                onClick={startEditing}
              >
                <RiEditBoxLine /> Edit
              </button>
              {!isCompleted && (
                <>
                  <button
                    type="button"
                    className="overflow-menu__item"
                    onClick={() => {
                      onCarryOver?.(task.id);
                      setMenuOpen(false);
                    }}
                  >
                    <RiTimeLine /> Carry over
                  </button>
                  <button
                    type="button"
                    className="overflow-menu__item"
                    onClick={() => {
                      onAbandon?.(task.id);
                      setMenuOpen(false);
                    }}
                  >
                    <RiCloseCircleLine /> Abandon
                  </button>
                </>
              )}
              <button
                type="button"
                className="overflow-menu__item overflow-menu__item--danger"
                onClick={() => {
                  onDelete?.(task.id);
                  setMenuOpen(false);
                }}
              >
                <RiDeleteBinLine /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description area */}
      {isEditing && isExpanded && (
        <textarea
          ref={textareaRef}
          className="edit__description"
          placeholder="Add a description (optional)"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleEditSubmit(e);
            }
          }}
        />
      )}
      {!isEditing && task.description && isExpanded && (
        <div className="single__task--description">{task.description}</div>
      )}
    </form>
  );

  // Focused and completed tasks are NOT wrapped in Draggable
  if (section === "focused" || section === "completed") {
    return renderContent();
  }

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          {renderContent(provided.dragHandleProps)}
        </div>
      )}
    </Draggable>
  );
};
export default SingleTask;
