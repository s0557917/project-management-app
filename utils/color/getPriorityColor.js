export function getPriorityColor(priority) {
    switch (priority) {
        case 1:
            return '#22c55e';
        case 2:
            return '#a3e635';
        case 3:
            return '#fde047';
        case 4:
            return '#f59e0b';
        case 5:
            return '#dc2626';
        default:
            return '#000000';
    }
}