export default function Subtask({ taskData }){
    return(
        <div class="relative border-2 border-cyan-500 p-2 m-2 rounded">
            <input class="form-check-input appearance-none rounded-full h-4 w-4 border border-rose-600 bg-rose-600 checked:bg-emerald-400 checked:border-emerald-400 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1"></input>
            <label class="form-check-label inline-block" for="flexRadioDefault1">
                <div>
                    <div class="absolute inset-y-0 flex items-center m-1">
                        {(taskData.completed) 
                            ? <h2><s>{taskData.title}</s></h2> 
                            : <h2>{taskData.title}</h2>}
                    </div>
                </div>
            </label>
        </div>
    )
}