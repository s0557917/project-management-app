import { QueryClient } from "@tanstack/react-query";
import { prismaGetAllTasks } from "../queryFunctions/tasks";

export const tasksQuery = async (queryClient) => {
    await queryClient.prefetchQuery(['tasks'], prismaGetAllTasks(session.user.email));
}

export const categoriesQuery = async (queryClient) => {
    await queryClient.prefetchQuery(['categories'], prismaGetAllCategories(session.user.email));
}

export const settingsQuery = async (queryClient) => {
    await queryClient.prefetchQuery(['settings'], prismaGetAllCategories(session.user.email));
}