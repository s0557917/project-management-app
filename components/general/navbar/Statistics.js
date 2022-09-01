import dayjs from "dayjs";
import { StatsRing } from "./StatsRing";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../../../utils/db/queryFunctions/tasks";
import { getUniqueDates } from "../../../utils/dates/getUniqueDates";
import { useState } from "react";
import { RingProgress } from "@mantine/core";
import getThemeColor from "../../../utils/color/getThemeColor";
import { useRef } from "react";
import useOutsideAlerter from "../../../utils/hooks/useOutsideAlerter";

export default function Statistics() {

    const {data: tasks, isFetching: isFetchingTasks} = useQuery(['tasks'], getAllTasks);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const trackedDays = generateStatistics();

    const textColor = getThemeColor('text-gray-900', 'text-white');
    const bgColor = getThemeColor('bg-white', 'bg-neutral-600');


    function generateStatistics() {

        if(tasks) {
            const limitDate = dayjs(new Date()).subtract(7, 'day').toDate();
            const filteredTasks = tasks.filter(task => new Date(task.updatedAt) >= limitDate && new Date(task.updatedAt) < new Date());
            const uniqueDates = getUniqueDates(filteredTasks);

            return uniqueDates.size ;
        }
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setIsPopoverOpen);

    return (
        
        <div 
            className={`relative mr-3 self-center`}
            ref={wrapperRef}
        >
            <StatsRing
                data={{
                    "label": "Task Activity",
                    "stats": `${trackedDays ? `${trackedDays}/7` :''}`,
                    "progress": `${trackedDays ? `${(trackedDays/7 * 100)}` : 0}`,
                    "color": trackedDays > 3 ? "green" : "red",
                    "icon": "up"
                }}
                isPopoverOpen={isPopoverOpen}
                setIsPopoverOpen={setIsPopoverOpen}
            />
            {isPopoverOpen && 
                <div 
                    className={`absolute top-12 w-72 -right-2 p-2 rounded-md flex items-center justify-between ${bgColor} z-10`}
                >
                    <RingProgress
                        size={50}
                        roundCaps
                        thickness={4}
                        sections={[{ 
                            value: `${trackedDays ? `${(trackedDays/7 * 100)}` : 0}`, 
                            color: trackedDays > 3 ? "green" : "red" 
                        }]}
                        label={
                            <p className={`text-center text-lg font-bold ${textColor}`}>
                                {`${trackedDays ? `${trackedDays}/7` :''}`}
                            </p>
                        }
                    />
                    <div className="ml-2">
                        <p className={`${textColor} text-lg font-bold mb-1`}>{trackedDays > 3 ? 'Keep it up!' : 'Make it happen!'}</p>
                        <p className={`${textColor} text-xs`}>{trackedDays > 3 ? 'You have worked on your tasks at least 3 out of the last 7 days!' : 'Try to work on your tasks at least 3 days a week!'}</p>
                    </div>
                </div>
            }
        </div>
    )
}