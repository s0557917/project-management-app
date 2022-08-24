import { NativeSelect } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDefaultView, updateDefaultView } from "../../../../utils/db/queryFunctions/settings";
import { uncapitalizeFirstLetter } from "../../../../utils/text/textFormatting";

export default function DefaultViewInformation() {
    const queryClient = useQueryClient();

    const {data: defaultView, isFetching: isFetchingDefaultView} = useQuery(['defaultView'], getDefaultView);
    const updateDefaultViewMutation = useMutation(
        (updatedDefaultView) => updateDefaultView(updatedDefaultView),
        {onSuccess: async () => {
            queryClient.invalidateQueries('defaultView');
        }}
    );
        
    return (
        <>
            <div className="flex mx-3 my-2 items-center">
                <p className="text-xs w-2/5">Default View</p>
                <div className="ml-5 w-3/5">
                    <NativeSelect 
                        value={defaultView}
                        onChange={(event) => {
                            updateDefaultViewMutation.mutate(uncapitalizeFirstLetter(event.target.value))
                        }}
                        data={[
                            { value: 'task-list', label: 'Task List' },
                            { value: 'calendar', label: 'Calendar' },
                            { value: 'text-editor', label: 'Text Editor' }
                        ]}
                    />
                </div>
            </div>   
        </>
    )
}