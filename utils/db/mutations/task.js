import { useMutation } from "@tanstack/react-query";
import { addNewTask, updateTask } from "../queryFunctions/tasks";

export const newTaskMutation = (queryClient) => {
    useMutation(
        (newTask) => addNewTask(newTask),
        {
            onMutate: async (newTask) => {
                console.log("newTask", newTask);
            },
            onSuccess: async () => {
                queryClient.invalidateQueries('tasks');
            },
            onSettled: async (data, error, variables, context) => {
                console.log("settled", data, error, variables, context);
            }
        }
    )
}

// const updateTaskMutation = useMutation(
//     (updatedTask) => updateTask(updatedTask),
//     {onSuccess: async () => {
//         queryClient.invalidateQueries('tasks');
//     }}
// )