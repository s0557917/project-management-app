import { Circle } from 'phosphor-react';

export default function CategoryContainer({title, color, children}){
    return (
        <div className="my-6 mx-3 p-2">
            <div className="flex items-center">
                {
                    color && 
                    <Circle 
                    size={32} 
                    color={ color } 
                    weight="fill" 
                />
                }
                <h2 className="text-3xl mx-2">{title}</h2>
            </div>
            {children}
        </div>
    )
}