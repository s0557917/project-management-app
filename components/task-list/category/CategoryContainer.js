import { Circle } from 'phosphor-react';

export default function CategoryContainer({title, color, children}){
    
    const titleColorStyle = color !== undefined ? {textDecoration: "underline", textDecorationColor: color} : {};

    return (
        <div className="my-6 mx-3 p-2">
            <div class={`flex items-center my-1`}>
                {/* {
                    color && 
                    <Circle 
                    size={32} 
                    color={ color } 
                    weight="fill" 
                />
                } */}
                <h2 className="text-3xl mx-2 py-1" style={titleColorStyle}>{title}</h2>
            </div>
            {children}
        </div>
    )
}