import Dialogue from "../general/dialogues/Dialogue";
import { NativeSelect } from "@mantine/core";
import { useState } from "react";

export default function CategoryDialogue({categoryDialogueState, category, categoryDialogueCallback, categories}) {
    
    const [categoryDialogueOpened, setCategoryDialogueOpened] = categoryDialogueState;

    return (
        <Dialogue
            opened={categoryDialogueOpened}
            onClose={() => setCategoryDialogueOpened(false)}
            title="Select a category"
        >
            <NativeSelect
                placeholder="Select a category"
                value={category}
                data={categories.map(category =>(
                    { 
                        value: category.id, 
                        label: category.name
                    }
                ))}
                onChange={(event) => {
                    categoryDialogueCallback(event.target.value);
                    setCategoryDialogueOpened(false);

                }}
            />
        </Dialogue>
    )
}