import DialogueSaveButton from "../buttons/DialogueSaveButton"
import { Modal } from "@mantine/core"

export default function Dialogue({ opened, onClose, title, saveButtonCallback, children }) {
    return (
        <Modal 
            centered
            opened={opened}
            onClose={() => onClose()}
            title={title}
        >  
            {children}
            {saveButtonCallback 
                ? <DialogueSaveButton onClickCallback={() => saveButtonCallback()} buttonText="Save" />  
                : null
            }
        </Modal>
    )
}