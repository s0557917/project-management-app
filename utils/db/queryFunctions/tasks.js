export const getAllTasks = async () => {
    const res = await fetch(`/api/tasks`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
}

export const addNewTask = async (taskData) => {
    const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
    const resp = res.json();

    return resp;
}

export const updateTask = async ( modifiedTask ) => {
    const res = await fetch(`/api/tasks/${modifiedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedTask),
    });
    return res.json();
}

export const deleteTask = async ( taskId ) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
}