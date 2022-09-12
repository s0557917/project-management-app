import prisma from '../../prisma';

export const prismaGetTextEditorStructure = async (userEmail) => {
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });
    
    return user.textEditorStructure;
}