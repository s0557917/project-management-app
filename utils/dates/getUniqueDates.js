export function getUniqueDates(tasks) {
    const dates = new Set();
    tasks?.forEach(task => {
        if(task.dueDate) {
            dates.add(new Date(task.dueDate).toLocaleDateString('en-GB'));
        }
    });

    return dates;
}