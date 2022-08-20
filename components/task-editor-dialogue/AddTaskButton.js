import { Group, ActionIcon } from "@mantine/core"
import { Plus } from "phosphor-react";

export default function AddTaskButton({ modalStateSetter }) {
    return (
        <div className="relative">
            <button 
                className="fixed right-5 bottom-2 mx-auto flex justify-center hover:bg-blue-700 bg-cyan-500 m-3 p-3 text-white rounded-full w-24 h-24 justify-center items-center" 
                onClick={() => modalStateSetter(true)}
            >
                <Plus size={88} />
            </button>
        </div>
    )
}