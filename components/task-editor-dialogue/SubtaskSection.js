import { Title } from "@mantine/core"
import SubtaskDialogue from "./SubtaskDialogue"
import Sublist from "../task-list/Sublist"

export default function SubtaskSection({ tasks, categories, selectedTask }) {
    return (
        <div className='bg-zinc-800 rounded-lg p-3'>
            <div className='flex justify-between'>
                <Title order={4}>Subtasks</Title>
                <SubtaskDialogue tasks={tasks} categories={categories} selectedTask={selectedTask}/>
            </div>
                <Sublist tasks={tasks?.filter((task) => selectedTask?.subtasks?.includes(task.id))}/>
        </div>
    )
}