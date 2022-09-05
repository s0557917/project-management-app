import { Prohibit } from "phosphor-react";

export default function UpdateButton({canUpdate, onUpdate}) {
    return (
        <div className="mt-3 mr-3">
            <button 
                disabled={!canUpdate}
                className={`my-auto ${canUpdate ? 'bg-green-700 hover:bg-green-800 hover:scale-105 active:scale-95 cursor-pointer' : 'bg-green-200 cursor-not-allowed'} transition-all text-white font-bold p-2 rounded`}
                onClick={onUpdate}
            >
                {canUpdate 
                    ? <h1>Update</h1>
                    : <div className="flex items-center">
                        <Prohibit size={16} color="#d12929" weight="bold" />
                        <p className="pl-2">Update</p>
                    </div>
                }
            </button>
        </div>
    )
}