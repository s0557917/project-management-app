import Dialogue from "../../general/dialogues/Dialogue";
import PriorityButton from "../../general/buttons/PriorityButton";
import getThemeColor from "../../../utils/color/getThemeColor";

export default function PriorityDialogue({ priorityDialogueState, priorityDialogueCallback, priorityState }) {
    
    const [priorityDialogueOpened, setPriorityDialogueOpened] = priorityDialogueState;
    
    const border = `border-2 ${getThemeColor('border-gray-900', 'border-white')}`
    const scale = `hover:scale-105 transition-all active:scale-95`
    
    return (
        <Dialogue
            opened={priorityDialogueOpened}
            onClose={() => setPriorityDialogueOpened(false)}
            title="Set a priority"
        >
            <div className="flex">
                <PriorityButton 
                    styling={`hover:bg-green-400 bg-green-500 ${scale} ${priorityState === 1 ? border : ''}`} 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(1);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P1"
                />

                <PriorityButton 
                    styling={`hover:bg-lime-300 bg-lime-400 ${scale} ${priorityState === 2 ? border : ''}`} 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(2);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P2"
                />

                <PriorityButton 
                    styling={`hover:bg-yellow-200 bg-yellow-300 ${scale} ${priorityState === 3 ? border : ''}`}  
                    buttonClickCallback={() => {
                        priorityDialogueCallback(3);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P3"
                />

                <PriorityButton 
                    styling={`hover:bg-amber-400 bg-amber-500 ${scale} ${priorityState === 4 ? border : ''}`} 
                    buttonClickCallback={() => {
                        priorityDialogueCallback(4);
                        setPriorityDialogueOpened(false);
                    }}
                    text="P4"
                />

                <PriorityButton
                    styling={`hover:bg-red-500 bg-red-600 ${scale} ${priorityState === 5 ? border : ''}`} 
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