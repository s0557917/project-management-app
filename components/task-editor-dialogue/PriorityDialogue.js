import Dialogue from "../general/dialogues/Dialogue"
import PriorityButton from "../general/buttons/PriorityButton";

export default function PriorityDialogue({ priorityDialogueState, priorityDialogueCallback }) {
    
    const [priorityDialogueOpened, setPriorityDialogueOpened] = priorityDialogueState;

    return (
        <Dialogue
            opened={priorityDialogueOpened}
            onClose={() => setPriorityDialogueOpened(false)}
            title="Set a priority"
        >
            <div className="flex">
                <PriorityButton 
                    styling="bg-green-500" 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(1);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P1"
                />

                <PriorityButton 
                    styling="bg-lime-400" 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(2);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P2"
                />

                <PriorityButton 
                    styling="bg-yellow-300" 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(3);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P3"
                />

                <PriorityButton 
                    styling="bg-amber-500" 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(4);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P4"
                />

                <PriorityButton
                    styling="bg-red-600" 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(5);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P5"
                />
            </div>
        </Dialogue>
    )
}