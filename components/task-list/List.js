import Task from "./Task";

export default function List({ tasks, categories, modalStateSetter, selectedTaskSetter }) {
  
  function generateCategories() {
    let categoriesJSX = [];
    categories.forEach(category => {
        let tasksInCategory = tasks.filter(task => task.category === category.id);
        categoriesJSX.push(
          <>
            <h2>{category.name}</h2>
            {tasksInCategory.map(task => <Task taskData={task} selectedTaskSetter={selectedTaskSetter} onTaskClicked={onTaskClicked} key={task.id}/>)}
          </>
        )
    })

    return categoriesJSX;
  }

  function onTaskClicked(taskData) {
      selectedTaskSetter(taskData);
      modalStateSetter(true);
  }
  
  return (
    <div className="w-11/12">
      <ul>
        {generateCategories()}
      </ul>
    </div>
  );
}