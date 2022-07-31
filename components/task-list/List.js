import Task from "./Task";

export default function List({ tasks, modalStateSetter, selectedTaskSetter }) {
      
  function onTaskClicked(taskData) {
      selectedTaskSetter(taskData);
      modalStateSetter(true);
  }
  
  return (
    <div className="w-11/12">
      <ul>
        {tasks.map(task => <Task taskData={task} selectedTaskSetter={selectedTaskSetter} onTaskClicked={onTaskClicked} key={task.id}/>)}
      </ul>
    </div>
  );
}