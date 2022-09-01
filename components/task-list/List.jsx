import CategorySortingView from "./views/CategorySortingView";
import DateSortingView from "./views/DateSortingView";
import PrioritySortingView from "./views/PrioritySortingView";
import { useQuery } from "@tanstack/react-query";
import { getSorting } from "../../utils/db/queryFunctions/settings";
import { getFilters } from "../../utils/db/queryFunctions/settings";
import LoadingScreen from "../general/loading/LoadingScreen";
import ListSkeleton from "../general/loading/ListSkeleton";
import SubtaskSortingView from "./views/SubtaskSortingView";

export default function List({ tasks, categories, modalStateSetter, selectedTaskSetter, onCompletionStateChanged, userSettings }) {
  
  const {data: sortingLogic, isFetching: isFetchingSorting} = useQuery(['sorting'], getSorting)
  const {data: filters, isFetching: isFetchingFilters} = useQuery(['filters'], getFilters);

  function generateListContent(){
    switch(sortingLogic){
      case 'category':
        return <CategorySortingView 
            tasks={tasks}
            categories={categories}
            filters={filters}
            onTaskClicked={onTaskClicked}
            onCompletionStateChanged={onCompletionStateChanged}
          />
      case 'date':
        return <DateSortingView 
          tasks={tasks}
          categories={categories}
          onTaskClicked={onTaskClicked}
          onCompletionStateChanged={onCompletionStateChanged}
          filters={filters}
        />;
      case 'priority':
        return <PrioritySortingView 
          tasks={tasks}
          categories={categories}
          onTaskClicked={onTaskClicked}
          onCompletionStateChanged={onCompletionStateChanged}
          filters={filters}
        />;
      case 'subtasks':
        return <SubtaskSortingView
          tasks={tasks} 
          categories={categories}
          onTaskClicked={onTaskClicked}
          onCompletionStateChanged={onCompletionStateChanged}
        />
      default:
        return <ListSkeleton />;
    }
  }

  function onTaskClicked(taskData) {
      selectedTaskSetter(taskData);
      modalStateSetter(true);
  }

  return (
    <div className="w-full">
      <ul className="w-full">
        {generateListContent()}
      </ul>
    </div>
  )
}