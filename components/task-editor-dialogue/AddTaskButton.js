import { Group, ActionIcon } from "@mantine/core"
import { Plus } from "phosphor-react";

export default function AddTaskButton({ modalStateSetter }) {
    return (
        <div className="relative">
            <button 
                className="fixed right-10 bottom-5 mx-auto flex hover:bg-blue-700 hover:scale-110 active:scale-90 transition-all bg-cyan-500 m-3 p-3 text-white rounded-full w-24 h-24 justify-center items-center" 
                onClick={() => modalStateSetter(true)}
            >
                <Plus size={88} />
            </button>
        </div>
    )
}