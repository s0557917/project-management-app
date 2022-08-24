import Category from "../ListBlock/ListBlock";

export default function CategorySortingView ({tasks, categories, filters, onTaskClicked, onCompletionStateChanged}) {
    
  function generateCategories() {  
    return categories
      ?.sort((a, b) => a.name.localeCompare(b.name))
      ?.map(category => {
        
        let tasksInCategory = tasks
        ?.sort((a, b) => a.title.localeCompare(b.title))
        ?.filter(task => task.categoryId === category.id && !task.completed);  

        return <Category
          key={category.id}
          tasks={tasksInCategory}
          categories={categories}
          onTaskClicked={onTaskClicked}
          onCompletionStateChanged={onCompletionStateChanged}
          category={category}
          title={category.name}
          active={category.active}
        />
    });
  }
    
    function buildCompletedSection(){
        const active = filters?.find(setting => setting.name === 'Completed').value;
        let completedTasks = tasks?.filter(task => task.completed);     

        return <Category
          key={'completed'}
          tasks={completedTasks}
          categories={categories}
          onTaskClicked={onTaskClicked}
          onCompletionStateChanged={onCompletionStateChanged}
          active={active}
          category={''}
          title={'Completed'}
        />
    }

    function buildUncategorizedSection(){
        const active = filters?.find(setting => setting.name === 'Uncategorized').value;
    
        let uncategorizedTasks = tasks?.filter(task => (task.categoryId === null || task.category === '') && !task.completed);     
        return <Category
          key={'uncategorized'}
          tasks={uncategorizedTasks}
          categories={categories}
          onTaskClicked={onTaskClicked}
          onCompletionStateChanged={onCompletionStateChanged}
          category={''}
          title={'Uncategorized'}
          active={active}
        />
    }

    return (
        <>
            {generateCategories()}
            {buildCompletedSection()}
            {buildUncategorizedSection()}
        </>
    )
}