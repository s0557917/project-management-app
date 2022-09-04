import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewTask } from "../queryFunctions/tasks";
import { showNotification } from "@mantine/notifications";

export const newTaskMutation = useMutation(
    (newTask) => addNewTask(newTask),
    {
        onSuccess: async () => {
            // const queryClient = useQueryClient();
            // queryClient.invalidateQueries('tasks');
            showNotification({
                autoClose: 3000,
                type: 'success',
                color: 'green',
                title: 'New task saved successfully!',
            });
        },
    }
);