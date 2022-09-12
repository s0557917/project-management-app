import prisma from '../../prisma';

export const prismaGetAllCategories = async (userEmail) => {
    const categories = await prisma.category.findMany({
        where: {
            owner: { email: userEmail },
        },
    });

    return categories;
}