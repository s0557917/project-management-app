import Task from "./Task";

export default function List({ tasks, categories, modalStateSetter, selectedTaskSetter }) {
  
  function generateCategories() {

    let categoriesJSX = [];

    categories.forEach(category => {
        let tasksInCategory = tasks.filter(task => task.category === category.id);        
        categoriesJSX.push(
          <div className="mx-4 p-2">
            <div className="flex items-center">
              <span className={`bg-[${category.color}] rounded-full w-6 h-6 m-3`}></span>
              <h2 className="text-2xl">{category.name}</h2>
            </div>
            {tasksInCategory.map(task => <Task taskData={task} onTaskClicked={onTaskClicked} category={categories.find(category => category.id === task.category).name || ''} key={task.id}/>)}
          </div>
        )
    })

    let uncategorizedTasks = tasks.filter(task => task.category === null || task.category === '');
    if(uncategorizedTasks.length > 0) {
      categoriesJSX.push(
        <div className="mx-4 p-2">
          <div className="flex items-center">
            <span className={`bg-slate-900] rounded-full w-6 h-6 m-3`}></span>
            <h2 className="text-2xl">Uncategorized</h2>
          </div>
          {uncategorizedTasks.map(task => <Task taskData={task} onTaskClicked={onTaskClicked} category={categories.find(category => category.id === task.category)} key={task.id}/>)}
        </div>
      );
    }
    
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