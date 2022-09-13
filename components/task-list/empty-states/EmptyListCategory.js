export default function EmptyListCategory(setIsNewTaskModalOpen, message='No tasks in this category yet...') {
    return (
        <div className="p-2 flex items-center">
            <p className={`text-gray-900' text-md`}>
                No tasks in this category yet...
            </p>
            <button 
                className="rounded-full text-xl bg-green-600 hover:scale-105 active:scale-95 text-white ml-3 w-7 h-7 justify-center"
                onClick={() => setIsNewTaskModalOpen(true)}    
            >
                <span className="justify-self-center">+</span>
            </button>
        </div>
    )
}