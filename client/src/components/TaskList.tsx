import { Task } from "../model";
import SingleTask from "./SingleTask";
import { Droppable } from "react-beautiful-dnd";

interface Props {
  allTask: Task[];
  setAllTask: React.Dispatch<React.SetStateAction<Task[]>>;
  completedTasks: Task[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskList: React.FC<Props> = ({
  allTask,
  setAllTask,
  completedTasks,
  setCompletedTasks,
}) => {
  return (
    <div className="container">
      <Droppable droppableId="AllTasksList">
        {(provided, snapshot) => (
          <div
            className={`tasks ${snapshot.isDraggingOver ? "drag__active" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="allTask__heading">active tasks</span>
            {allTask.map((eachTask, index) => (
              <SingleTask
                index={index}
                key={eachTask.id}
                task={eachTask}
                allTask={allTask}
                setAllTask={setAllTask}
                completedTasks={completedTasks}
                setCompletedTasks={setCompletedTasks}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="AllTasksCompleted">
        {(provided, snapshot) => (
          <div
            className={`tasks ${
              snapshot.isDraggingOver ? "drag__complete" : "completed"
            } `}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="allTask__heading">completed tasks</span>
            {completedTasks.map((eachTask, index) => (
              <SingleTask
                index={index}
                key={eachTask.id}
                task={eachTask}
                allTask={completedTasks}
                setAllTask={setCompletedTasks}
                completedTasks={completedTasks}
                setCompletedTasks={setCompletedTasks}
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
