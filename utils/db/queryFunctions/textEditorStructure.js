export const getTextEditorStructure = async () => {
    const res = await fetch(`/api/textEditorStructure`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
}

export const updateTextEditorStructure = async (textEditorStructureUpdate) => {
    console.log("UPDATE TEXT EDITOR STRUCTURE", textEditorStructureUpdate);
    const res = await fetch(`/api/textEditorStructure`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(textEditorStructureUpdate),
    });

    return res.json(); 
}