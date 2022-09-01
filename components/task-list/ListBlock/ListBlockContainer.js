import getThemeColor from "../../../utils/color/getThemeColor";
import { PencilSimple, Trash } from "phosphor-react";
import { useState } from "react";

export default function ListBlockContainer({title, color, children, onEdit, onRemove, displayIcons}){
    
    const titleColorStyle = color !== undefined ? {textDecoration: "underline", textDecorationColor: color} : {};
    const [iconVisible, setIconVisible] = useState(false);

    return (
        <div className="my-6 mx-3 p-2">
            <div className={`flex items-center my-1`}>
                {title 
                    ? <div 
                        className="flex items-baseline w-full"
                        onMouseEnter={() => setIconVisible(true)}
                        onMouseLeave={() => setIconVisible(false)}
                    >
                        <h2 className={`text-xl mx-2 mb-4 py-1 font-bold ${getThemeColor('text-gray-900', 'text-white')}`} style={titleColorStyle}>
                            {title}
                        </h2>
                        {
                            displayIcons && iconVisible &&
                            <div>
                                <button 
                                    className="hover:cursor-pointer hover:scale-105 active:scale-95 cursor-pointer transition-all"
                                    onClick={onEdit}
                                >
                                    <PencilSimple 
                                        size={20} 
                                        color='#16a34a' 
                                        weight="regular" 
                                    />
                                </button>
                                <button 
                                    className="hover:cursor-pointer hover:scale-105 active:scale-95 cursor-pointer transition-all"
                                    onClick={onRemove}
                                >
                                    <Trash 
                                        size={20} 
                                        color="#16a34a" 
                                        weight="regular" 
                                    /> 
                                </button>
                            </div>
                        }
                    </div>
                    : null
                }
            </div>
            {children}
        </div>
    )
}