import { Group, ActionIcon } from "@mantine/core"
import { Plus } from "phosphor-react";

export default function AddTaskButton({ modalStateSetter }) {
    return (
        <Group position="center">
            <button className="mx-auto flex justify-center hover:bg-blue-700 bg-cyan-500 m-3 p-3 text-white rounded-full w-24 h-24" onClick={() => modalStateSetter(true)}>
                <Plus size={88} />
            </button>
        </Group>
    )
}