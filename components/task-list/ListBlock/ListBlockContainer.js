import getThemeColor from "../../../utils/color/getThemeColor";

export default function ListBlockContainer({title, color, children, theme}){
    
    const titleColorStyle = color !== undefined ? {textDecoration: "underline", textDecorationColor: color} : {};

    return (
        <div className="my-6 mx-3 p-2">
            <div className={`flex items-center my-1`}>
                {title 
                    ? <h2 className={`text-xl mx-2 mb-4 py-1 font-bold ${getThemeColor('text-gray-900', 'text-white')}`} style={titleColorStyle}>
                        {title}
                        </h2>
                    : null
                }
            </div>
            {children}
        </div>
    )
}