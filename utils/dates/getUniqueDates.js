export function getUniqueDueDates(tasks) {

    const dates = new Set();
    tasks?.forEach(task => {
        if(task.dueDate) {
            dates.add(new Date(task.dueDate).toLocaleDateString('en-GB'));
        }
    });

    return dates;
}

export function getUniqueUpdateDates(tasks) {

    const dates = new Set();
    tasks?.forEach(task => {
        if(task.updatedAt) {
            dates.add(new Date(task.updatedAt).toLocaleDateString('en-GB'));
        }
    });

    return dates;
}