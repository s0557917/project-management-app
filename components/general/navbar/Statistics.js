import dayjs from "dayjs";
import { StatsRing } from "./StatsRing";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../../../utils/db/queryFunctions/tasks";
import { getUniqueDates } from "../../../utils/dates/getUniqueDates";
import { Menu } from "@mantine/core";

export default function Statistics() {

    const {data: tasks, isFetching: isFetchingTasks} = useQuery(['tasks'], getAllTasks);
    const trackedDays = generateStatistics();


    function generateStatistics() {
        if(tasks) {
            const limitDate = dayjs(new Date()).subtract(7, 'day').toDate();
            
            const filteredTasks = tasks.filter(task => task.dueDate 
                && dayjs(task.dueDate).isAfter(limitDate) 
                && dayjs(task.dueDate).isBefore(new Date()));
            const uniqueDates = getUniqueDates(filteredTasks);

            return uniqueDates.size ;
        }
    }

    return (
        <div className="mr-3 self-center hover:scale-105 active:scale-95 cursor-pointer">
            <Menu width={300}>
                <Menu.Target>
                    <StatsRing
                            data={{
                                "label": "Tracked Tasks",
                                "stats": `${trackedDays}/7` || '0/7',
                                "progress": (trackedDays/7 * 100) || 0,
                                "color": trackedDays > 3 ? "green" : "red",
                                "icon": "up"
                            }}
                    />
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item component="p">
                        <div className="m-2">
                            <p>{trackedDays > 3 ? `Congrats you have kept track of your tasks ${trackedDays} ouf of 7 days!` : "Try to keep track of your tasks at least 3 days a week!"}</p>
                        </div>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}