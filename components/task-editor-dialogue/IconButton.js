export default function IconButton({state, buttonCallback, children}) {
    return (
        <div className='m-1 p-1 bg-cyan-500 hover:bg-cyan-700 hover:text-gray-50 text-slate-800 rounded'>
            <button className="flex items-center" onClick={buttonCallback}>
                {children} {state !== undefined ? <p className="text-sm">{state}</p> : null}
            </button>
            
        </div>
    )
}