import CategorySortingView from "./views/CategorySortingView";
import DateSortingView from "./views/DateSortingView";
import PrioritySortingView from "./views/PrioritySortingView";
import { useQuery } from "@tanstack/react-query";
import { getSorting } from "../../utils/db/queryFunctions/settings";
import { getFilters } from "../../utils/db/queryFunctions/settings";
import LoadingScreen from "../general/loading/LoadingScreen";

export default function List({ tasks, categories, modalStateSetter, selectedTaskSetter, onCompletionStateChanged, userSettings }) {
  
  const {data: sortingLogic, isFetching: isFetchingSorting} = useQuery(['sorting'], getSorting)
  const {data: filters, isFetching: isFetchingFilters} = useQuery(['filters'], getFilters);

  function generateListContent(){
    if(sortingLogic && !isFetchingSorting) {
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
        default:
          return <></>;
      }
    } else {
      return <LoadingScreen />;
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