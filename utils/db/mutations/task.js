import { useMutation } from "@tanstack/react-query";
import { addNewTask, updateTask } from "../queryFunctions/tasks";

export const newTaskMutation = (queryClient) => {
    useMutation(
        (newTask) => addNewTask(newTask),
        {
            onSuccess: async () => {
                queryClient.invalidateQueries('tasks');
            },
        }
    )
}

// const updateTaskMutation = useMutation(
//     (updatedTask) => updateTask(updatedTask),
//     {onSuccess: async () => {
//         queryClient.invalidateQueries('tasks');
//     }}
// )