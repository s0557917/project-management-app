import Dialogue from "../../general/dialogues/Dialogue";
import PriorityButton from "../../general/buttons/PriorityButton";

export default function PriorityDialogue({ priorityDialogueState, priorityDialogueCallback, priorityState }) {
    
    const [priorityDialogueOpened, setPriorityDialogueOpened] = priorityDialogueState;

    return (
        <Dialogue
            opened={priorityDialogueOpened}
            onClose={() => setPriorityDialogueOpened(false)}
            title="Set a priority"
        >
            <div className="flex">
                <PriorityButton 
                    styling={`hover:bg-green-300 bg-green-500 ${priorityState === 1 ? 'border-4 border-white' : ''}`} 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(1);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P1"
                />

                <PriorityButton 
                    styling={`hover:bg-lime-200 bg-lime-400 ${priorityState === 2 ? 'border-2 border-cyan-500' : ''}`} 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(2);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P2"
                />

                <PriorityButton 
                    styling={`hover:bg-yellow-100 bg-yellow-300 ${priorityState === 3 ? 'border-2 border-cyan-500' : ''}`}  
                    buttonClickCallback={() => {
                        priorityDialogueCallback(3);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P3"
                />

                <PriorityButton 
                    styling={`hover:bg-amber-300 bg-amber-500 ${priorityState === 4 ? 'border-2 border-cyan-500' : ''}`} 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(4);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P4"
                />

                <PriorityButton
                    styling={`hover:bg-red-400 bg-red-600 ${priorityState === 5 ? 'border-2 border-cyan-500' : ''}`} 
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