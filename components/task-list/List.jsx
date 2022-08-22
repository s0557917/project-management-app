import Category from "./category/Category";
import CategoryCompletedTasks from "./category/CategoryCompletedTasks";
import { useState, useEffect } from "react";
import Task from "./Task";
import { ScrollArea, Loader } from "@mantine/core";

export default function List({ tasks, categories, modalStateSetter, selectedTaskSetter, onCompletionStateChanged, sortingMethod, userSettings, isFetchingUserSettings, isFetchingTasks, isFetchingCategories }) {
  
  const [listContent, setListContent] = useState(generateListElements());

  useEffect(() => {
    setListContent(generateListElements());
  }, [sortingMethod, isFetchingUserSettings, tasks, categories, isFetchingTasks, isFetchingCategories]);

  function generateListElements(){
    switch(sortingMethod){
      case 'category':
        return <>
          {generateCategories()}
          {buildUncategorizedSection()}
          {buildCompletedSection()}
        </>
      case 'date':
        return <>{generateDateSortedList()}</>;
      case 'priority':
        return <>{generatePrioritySortedList()}</>;
      default:
        return <></>;
    }
  }

  function generateDateSortedList() {
    return tasks
    ?.filter(task => categories?.find(category => category.id === task.categoryId)?.active)
    ?.sort((a, b) => (new Date(a.dueDate).getTime() || -Infinity) - (new Date(b.dueDate).getTime() || -Infinity))
    ?.map(task => 
      <Task
        taskData={task} 
        onTaskClicked={onTaskClicked} 
        onCompletionStateChanged={onCompletionStateChanged}
        category={ '' } 
        key={task.id}
      />
    );
  }

  function generatePrioritySortedList() {
    return tasks
      ?.filter(task => categories?.find(category => category.id === task.categoryId)?.active)
      ?.sort((a, b) => b.priority - a.priority)
      ?.map(task => 
        <Task
          taskData={task} 
          onTaskClicked={onTaskClicked} 
          onCompletionStateChanged={onCompletionStateChanged}
          category={ '' } 
          key={task.id}
        />
      );
  }

  function generateCategories() {  
    return categories
    ?.sort((a, b) => a.name.localeCompare(b.name))
    ?.map(category => {

      let tasksInCategory = tasks
      ?.sort((a, b) => a.title.localeCompare(b.title))
      ?.filter(task => task.categoryId === category.id);  

      return <Category
        key={category.id}
        tasks={tasksInCategory}
        onTaskClicked={onTaskClicked}
        onCompletionStateChanged={onCompletionStateChanged}
        category={category}
        title={category.name}
        active={category.active}
      />
    });
  }

  function buildUncategorizedSection(){
    const active = userSettings?.filters?.find(setting => setting.name === 'Uncategorized').value;

    let uncategorizedTasks = tasks?.filter(task => task.categoryId === null || task.category === '');     
    return <Category
      key={'uncategorized'}
      tasks={uncategorizedTasks}
      onTaskClicked={onTaskClicked}
      onCompletionStateChanged={onCompletionStateChanged}
      category={''}
      title={'Uncategorized'}
      active={active}
    />
  }

  function buildCompletedSection(){
    const active = userSettings?.filters?.find(setting => setting.name === 'Completed').value;
    let completedTasks = tasks?.filter(task => task.completed);     
    
    return <CategoryCompletedTasks
      key={'completed'}
      tasks={completedTasks}
      onTaskClicked={onTaskClicked}
      onCompletionStateChanged={onCompletionStateChanged}
      active={active}
    />
  }

  function onTaskClicked(taskData) {
      selectedTaskSetter(taskData);
      modalStateSetter(true);
  }

  return (
    <div className="w-11/12">
      {isFetchingTasks === true
      ? console.log("Loading tasks...")
      : <ul>
          {listContent}
        </ul>
      }
    </div>
  )
}