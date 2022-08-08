export default function PriorityButton({styling, buttonClickCallback, text}) {
    return (
        <button 
            className={`${styling} m-3 rounded-full text-slate-800 w-14 h-14`} 
            onClick={() => buttonClickCallback()}
        >
            {text}
        </button>
    )
}