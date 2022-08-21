import Category from "./category/Category";
import CategoryCompletedTasks from "./category/CategoryCompletedTasks";
import { useState, useEffect } from "react";
import Task from "./Task";
import { ScrollArea } from "@mantine/core";

export default function List({ tasks, categories, activeCategories, modalStateSetter, selectedTaskSetter, onCompletionStateChanged, sortingMethod, userSettings, isFetching }) {
  
  const [listContent, setListContent] = useState(generateListElements());

  useEffect(() => {
    setListContent(generateListElements());
  }, [sortingMethod, activeCategories, tasks, userSettings, categories, isFetching]);

  function generateListElements(){
    switch(sortingMethod){
      case 'category':
        return generateCategories();
      case 'date':
        return generateDateSortedList();
      case 'priority':
        return generatePrioritySortedList();
      default:
        return;
    }
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

  function generateDateSortedList() {
    return tasks
    ?.filter(task => activeCategories?.find(activeCategory => activeCategory.id === task.categoryId)?.active)
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
      ?.filter(task => activeCategories?.find(activeCategory => activeCategory.id === task.categoryId)?.active)
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

  function buildAllCategorySections() {
    let categoriesJSX = [];
    
    categories.forEach(category => {
      if(!activeCategories.find(activeCategory => activeCategory.id === category.id).active) 
        return;
        
      let tasksInCategory = tasks.filter(task => task.categoryId === category.id);        
      categoriesJSX.push(
        <Category
          key={category.id}
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
    if(!userSettings?.filters?.find(setting => setting.name === 'Uncategorized').value){
      return null;   
    } 

    let uncategorizedTasks = tasks.filter(task => task.categoryId === null || task.category === '');     
    return <Category
      key={'uncategorized'}
      tasks={uncategorizedTasks}
      onTaskClicked={onTaskClicked}
      onCompletionStateChanged={onCompletionStateChanged}
      category={''}
      title={'Uncategorized'}
    />
  }

  function buildCompletedSection(){
    if(!userSettings?.filters?.find(setting => setting.name === 'Completed').value){
      return null;   
    } 

    let completedTasks = tasks.filter(task => task.completed);     
    return <CategoryCompletedTasks
      key={'completed'}
      tasks={completedTasks}
      onTaskClicked={onTaskClicked}
      onCompletionStateChanged={onCompletionStateChanged}
    />
  }

  function onTaskClicked(taskData) {
      selectedTaskSetter(taskData);
      modalStateSetter(true);
  }

  return (
    <div className="w-11/12">
        <ScrollArea
          offsetScrollbars={true}
          style={{ height: 600 }} 
          type="auto"
        >
          {listContent}
        </ScrollArea>
    </div>
  );
}