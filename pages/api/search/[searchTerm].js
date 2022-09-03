import { getSession } from 'next-auth/react';
import {prisma} from '../../../utils/prisma';

export default async function handler(req, res) {
    const session = await getSession({ req });
     if(req.method === 'GET' && session && req.query.searchTerm !== undefined && req.query.searchTerm.lentgth > 0){ 
        try {
            const tasks = await prisma.task.findMany({
                where: {
                    owner: { email: session?.user?.email },
                    title: { contains: req?.query?.searchTerm },
                },
            });
            res.status(200).json(tasks);
        } catch (e) {
            res.status(500).json({error: e});
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res
            .status(405)
            .json({message: `HTTP method ${req.method} not allowed!`});
    }
}