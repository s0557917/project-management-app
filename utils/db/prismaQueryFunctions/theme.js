import prisma from '../../prisma';

export const prismaGetTheme = async (userEmail) => {
    const res = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    return res.theme;
}