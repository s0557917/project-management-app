import Category from "./category/Category";
import CategoryCompletedTasks from "./category/CategoryCompletedTasks";

export default function List({ tasks, categories, modalStateSetter, selectedTaskSetter, onCompletionStateChanged }) {
  
  function buildAllCategorySections() {
    let categoriesJSX = [];
    
    categories.forEach(category => {
      let tasksInCategory = tasks.filter(task => task.category === category.id);        
      categoriesJSX.push(
        <Category
          tasks={tasksInCategory}
          onTaskClicked={onTaskClicked}
          onCompletionStateChanged={onCompletionStateChanged}
          category={category}
          title={category.name}
        />
      )
    })
    return categoriesJSX; 
  }

  function buildUncategorizedSection(){
    let uncategorizedTasks = tasks.filter(task => task.category === null || task.category === '');     
    return <Category
      tasks={uncategorizedTasks}
      onTaskClicked={onTaskClicked}
      onCompletionStateChanged={onCompletionStateChanged}
      category={''}
      title={'Uncategorized'}
    />
  }

  function buildCompletedSection(){
    let completedTasks = tasks.filter(task => task.completed);     
    return <CategoryCompletedTasks
      tasks={completedTasks}
      onTaskClicked={onTaskClicked}
      onCompletionStateChanged={onCompletionStateChanged}
    />
  }

  function generateCategories() {

    let categoriesJSX = [];
    categoriesJSX.push(
      buildAllCategorySections(),
      buildUncategorizedSection(),
      buildCompletedSection()
    );      
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