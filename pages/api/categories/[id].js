import { getSession } from 'next-auth/react';
import prisma from '../../../utils/prisma';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if(req.method === 'PUT' && session){
        try{
            const categoryData = {
                name: req.body.name,
                color: req.body.color,
                active: req.body.active,
            }
    
            const category = await prisma.category.update({
                where: { id: req.query.id },
                data: categoryData
            });

            res.status(201).json(category);
        } catch (e) {
            console.log("ERROR", e);
            res.status(500).json({error: e});
        }
    } else if(req.method === 'DELETE' && session){
        try {
    
            const tasks = await prisma.task.deleteMany({
                where: {
                    category: { id: req.query.id },
                },
            });

            const category = await prisma.category.delete({
                where: { id: req.query.id }
            });

            res.status(201).json(category);
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