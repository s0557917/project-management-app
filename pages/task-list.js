import ViewsTabs from "../components/general/ViewsTabs"
import List from "../components/task-list/List"
import sampleData from "../data/sample-tasks"
import { useState } from 'react'
import TaskEditorDialogue from "../components/task-editor-dialogue/TaskEditorDialogue"

export default function TaskList() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    return(
        <>
            <ViewsTabs />        
            <h1 className="text-3xl font-bold underline">Task List</h1>
            <List tasks={sampleData}/>

            <TaskEditorDialogue />
        </>
    )
}