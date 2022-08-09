export default function CategoryContainer({title, children}){
    return (
        <div className="mx-4 p-2">
            <div className="flex items-center">
                <span className={`bg-red-300 rounded-full w-6 h-6 m-3`}></span>
                <h2 className="text-2xl">{title}</h2>
            </div>
            {children}
        </div>
    )
}