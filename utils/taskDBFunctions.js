import {prisma} from "../utils/prisma";

export async function onNewTaskSaved(taskData, setOpened, setSelectedTask) {
    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    })
        .then((response) => response.json())
        .then((data) => setTasksState([...tasksState, data]));

    setOpened(false);
    setSelectedTask({});
}