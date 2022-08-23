export default function IconInformation({state, buttonCallback, children}) {
    return (
        <div className='mx-1 text-white'>
            <div className="flex items-center" onClick={buttonCallback}>
                {children}
            </div>
        </div>
    )
}