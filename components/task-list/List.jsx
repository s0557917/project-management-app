import { useState, useEffect } from "react";
import Task from "./task/Task";
import CategorySortingView from "./views/CategorySortingView";
import DateSortingView from "./views/DateSortingView";
import PrioritySortingView from "./views/PrioritySortingView";

export default function List({ tasks, categories, modalStateSetter, selectedTaskSetter, onCompletionStateChanged, sortingMethod, userSettings, isFetchingUserSettings, isFetchingTasks, isFetchingCategories }) {
  
  const [listContent, setListContent] = useState(generateListElements());

  useEffect(() => {
    setListContent(generateListElements());
  }, [sortingMethod, isFetchingUserSettings, tasks, categories, isFetchingTasks, isFetchingCategories]);

  function generateListElements(){

    switch(sortingMethod){
      case 'category':
        return <CategorySortingView 
            tasks={tasks}
            categories={categories}
            userSettings={userSettings}
            onTaskClicked={onTaskClicked}
            onCompletionStateChanged={onCompletionStateChanged}
          />
      case 'date':
        return <DateSortingView 
          tasks={tasks}
          categories={categories}
          onTaskClicked={onTaskClicked}
          onCompletionStateChanged={onCompletionStateChanged}
          userSettings={userSettings}
        />;
      case 'priority':
        return <PrioritySortingView 
          tasks={tasks}
          categories={categories}
          onTaskClicked={onTaskClicked}
          onCompletionStateChanged={onCompletionStateChanged}
          userSettings={userSettings}
        />;
      default:
        return <></>;
    }
  }

  function onTaskClicked(taskData) {
      selectedTaskSetter(taskData);
      modalStateSetter(true);
  }

  return (
    <div className="w-full">
      {isFetchingTasks === true
      ? <></>
      : <ul className="w-full">
          {listContent}
        </ul>
      }
    </div>
  )
}