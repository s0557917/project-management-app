import { Prohibit } from "phosphor-react";

export default function UpdateButton({canUpdate, onUpdate}) {
    return (
        <div className="flex items-center justify-end w-full mt-3">
            <button 
                disabled={!canUpdate}
                className={`${canUpdate ? 'bg-green-700 hover:bg-green-800 hover:scale-105 active:scale-95 cursor-pointer' : 'bg-green-200 cursor-not-allowed'} transition-all text-white font-bold mr-5 py-2 px-2 rounded`}
                onClick={onUpdate}
            >
                {canUpdate 
                    ? <p1>Update</p1>
                    : <div className="flex items-center">
                        <Prohibit size={16} color="#d12929" weight="bold" />
                        <p className="pl-2">Update</p>
                    </div>
                }
            </button>
        </div>
    )
}