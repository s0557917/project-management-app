import Task from "./Task";

export default function List({ tasks }) {
  return (
    <div className="task-list">
      <ul>
        {tasks.map(task => <Task taskData={task}/>)}
      </ul>
    </div>
  );
}