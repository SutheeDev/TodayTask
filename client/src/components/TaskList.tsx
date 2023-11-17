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
        {(provided) => (
          <div
            className="tasks"
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
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="AllTasksCompleted">
        {(provided) => (
          <div
            className="tasks completed"
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
