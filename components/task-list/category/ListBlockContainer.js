import { Circle } from 'phosphor-react';

export default function CategoryContainer({title, color, children}){
    
    const titleColorStyle = color !== undefined ? {textDecoration: "underline", textDecorationColor: color} : {};

    return (
        <div className="my-6 mx-3 p-2">
            <div className={`flex items-center my-1`}>
                {title 
                    ? <h2 className="text-white text-xl mx-2 mb-4 py-1 font-bold" style={titleColorStyle}>
                        {title}
                        </h2>
                    : null
                }
            </div>
            {children}
        </div>
    )
}