import { Modal } from "@mantine/core";

function ModalButton({ color, content, shouldDelete, setShouldDelete}) {
    
    return (
        <button
            className={`hover:scale-105 active:scale-95 cursor-pointer transition-al p-2 ${color} text-white rounded-md`}
            onClick={() => setShouldDelete(shouldDelete)}
        >
            {content}
        </button>
    )
}

export default function DeleteModal({ opened, setOpened, categoryName, setShouldDelete }) {
    return(
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            withCloseButton={false}
            centered
        >
            <div className="mb-4">
                <h1>Caution!</h1>
                <h2>You are about to delete the <span className="font-bold">{categoryName}</span> category!</h2>
            </div>
            <div className="flex items-center justify-evenly">
                <ModalButton
                    color="bg-green-500"
                    content="Go ahead!"
                    shouldDelete={true}
                    setShouldDelete={setShouldDelete}
                />

                <ModalButton
                    color="bg-red-500"
                    content="Don't do it!"
                    shouldDelete={false}
                    setShouldDelete={setShouldDelete}
                />
            </div>
        </Modal>
    )
}