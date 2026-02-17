import { Task } from "../model";
import SingleTask from "./SingleTask";
import { Droppable } from "react-beautiful-dnd";

interface Props {
  allTask: Task[];
  setAllTask: React.Dispatch<React.SetStateAction<Task[]>>;
  completedTasks: Task[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onFocus: (id: number) => void;
  onUnfocus: (id: number) => void;
  onComplete: (id: number) => void;
  onDelete: (id: number, fromCompleted?: boolean) => void;

  onCarryOver: (id: number) => void;
  onRestore: (id: number) => void;
  onEdit: (id: number, newTask: string, newDescription?: string) => void;
  onEditCompleted: (id: number, newTask: string, newDescription?: string) => void;
  onUncomplete: (id: number) => void;
}

const TaskList: React.FC<Props> = ({
  allTask,
  completedTasks,
  onFocus,
  onUnfocus,
  onComplete,
  onDelete,

  onCarryOver,
  onRestore,
  onEdit,
  onEditCompleted,
  onUncomplete,
}) => {
  const focusedTasks = allTask.filter((t) => t.isFocused && !t.isCarriedOver);
  const activeTasks = allTask.filter((t) => !t.isFocused && !t.isCarriedOver);
  const carriedOverTasks = allTask.filter((t) => t.isCarriedOver);

  return (
    <div className="container">
      {/* Left column */}
      <div className="left-column">
        {/* Focus section */}
        {focusedTasks.length > 0 && (
          <div className="tasks focused-section">
            <span className="allTask__heading">focus</span>
            {focusedTasks.map((eachTask, index) => (
              <SingleTask
                index={index}
                key={eachTask.id}
                task={eachTask}
                section="focused"
                onFocus={onFocus}
                onUnfocus={onUnfocus}
                onComplete={onComplete}
                onDelete={(id) => onDelete(id)}

                onCarryOver={onCarryOver}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}

        {/* Active section */}
        <Droppable droppableId="AllTasksList">
          {(provided, snapshot) => (
            <div
              className={`tasks ${snapshot.isDraggingOver ? "drag__active" : ""}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <span className="allTask__heading">active tasks</span>
              {activeTasks.map((eachTask, index) => (
                <SingleTask
                  index={index}
                  key={eachTask.id}
                  task={eachTask}
                  section="active"
                  onFocus={onFocus}
                  onUnfocus={onUnfocus}
                  onComplete={onComplete}
                  onDelete={(id) => onDelete(id)}
  
                  onCarryOver={onCarryOver}
                  onEdit={onEdit}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Carry-over section */}
        {carriedOverTasks.length > 0 && (
          <Droppable droppableId="CarriedOverList">
            {(provided) => (
              <div
                className="tasks carryover-section"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span className="allTask__heading">carried over</span>
                {carriedOverTasks.map((eachTask, index) => (
                  <SingleTask
                    index={index}
                    key={eachTask.id}
                    task={eachTask}
                    section="carried-over"
                    onFocus={onFocus}
                    onUnfocus={onUnfocus}
                    onComplete={onComplete}
                    onDelete={(id) => onDelete(id)}
    
                    onCarryOver={onCarryOver}
                    onRestore={onRestore}
                    onEdit={onEdit}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </div>

      {/* Right column: Completed */}
      <Droppable droppableId="AllTasksCompleted">
        {(provided, snapshot) => (
          <div
            className={`tasks ${
              snapshot.isDraggingOver ? "drag__complete" : "completed"
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="allTask__heading">completed tasks</span>
            {completedTasks.map((eachTask, index) => (
              <SingleTask
                index={index}
                key={eachTask.id}
                task={eachTask}
                section="completed"
                onComplete={onUncomplete}
                onDelete={(id) => onDelete(id, true)}
                onEdit={onEditCompleted}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
export default TaskList;
