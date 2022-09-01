export const prismaGetTextEditorStructure = async (userEmail) => {
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });
    
    return user.textEditorStructure;
}

export const getTextEditorStructure = async () => {
    const res = await fetch(`/api/textEditorStructure`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
}

export const updateTextEditorStructure = async (modifiedCategory) => {
    const res = await fetch(`/api/textEditorStructure`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedCategory),
    });

    return res.json(); 
}