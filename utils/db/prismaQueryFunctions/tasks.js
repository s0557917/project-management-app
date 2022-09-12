import prisma from '../../prisma';

export const prismaGetAllTasks = async (userEmail) => {
    const res = await prisma.task.findMany({
        where: {
            owner: { email: userEmail },
        },
    });

    return res;
}