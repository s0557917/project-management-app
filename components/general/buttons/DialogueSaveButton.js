export default function DialogueSaveButton({onClickCallback, buttonText}) {
    return(
        <button 
            className="flex hover:bg-cyan-700 bg-cyan-500 mb-3 my-3 p-3 text-white rounded-full" 
            onClick={() => onClickCallback()}
        >
            {buttonText}    
        </button>
    )
}