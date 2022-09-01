import { Modal, TextInput } from "@mantine/core"
import { useState } from "react"
import { Square } from "phosphor-react";
import ColorButton from "../../../general/menus/filtering-and-sorting/ColorButton";

export default function EditModal({ opened, setOpened, category, performEdit }) {
    const [categoryTitle, setCategoryTitle] = useState(category.name);
    const [selectedNewColor, setSelectedNewColor] = useState(category.color);

    const colors = ["#de1b1b","#de6c1b","#ded41b","#80de1b","#0f8717","#0ffcfc","#0fb1fc","#0f1ffc","#791bde","#c71bde","#de1b76","#000000"];

    return(
        <Modal
            title="Edit your category!"
            opened={opened}
            onClose={() => setOpened(false)}
            centered
            width="100px"
        >       	
            <div className="mx-10">
                <div className="flex items-center px-2">
                    <button className="hover:scale-105 active:95">
                        <Square size={48} color={selectedNewColor || '#d4d4d4'} weight="fill" />
                    </button>
                    <TextInput  
                        value={categoryTitle}
                        onChange={(event) => setCategoryTitle(event.currentTarget.value)}
                        label="Category name"
                        withAsterisk
                    />
                </div>
                <div className='grid grid-cols-6'>
                    {colors.map(color =>                                 
                        <button onClick={() => {
                            setSelectedNewColor(color);
                        }}>
                            <Square size={36} color={color} weight="fill" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex justify-center items-center mt-5">
                <button
                    className={`hover:scale-105 active:scale-95 cursor-pointer transition-al p-2 bg-green-500 text-white rounded-md`}
                    onClick={() => {
                        performEdit({name: categoryTitle, color: selectedNewColor});
                        setCategoryTitle("");
                        setSelectedNewColor("#d4d4d4");
                    }}
                >
                    Save
                </button>
            </div>
        </Modal>
    )
}