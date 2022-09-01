export function getUniqueDates(tasks) {

    const dates = new Set();
    tasks?.forEach(task => {
        if(task.updatedAt) {
            dates.add(new Date(task.updatedAt).toLocaleDateString('en-GB'));
        }
    });

    return dates;
}