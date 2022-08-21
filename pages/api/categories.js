import { getSession } from 'next-auth/react';
import prisma from '../../utils/prisma';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if(req.method === 'GET' && session){
        try{
            const categories = await prisma.category.findMany({
                where: {
                    owner: { email: session?.user?.email },
                },
            });
            res.status(201).json(categories);
        } catch (e) {
            console.log("ERROR", e);
            res.status(500).json({error: e});
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res
            .status(405)
            .json({message: `HTTP method ${req.method} not allowed!`});
    }
}