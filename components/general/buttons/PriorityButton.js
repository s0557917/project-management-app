export default function PriorityButton({styling, buttonClickCallback, text}) {
    return (
        <button 
            className={`${styling} m-4 rounded-full text-slate-800 p-3`} 
            onClick={() => buttonClickCallback()}
        >
            {text}
        </button>
    )
}