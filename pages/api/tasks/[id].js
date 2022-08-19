import { getSession } from 'next-auth/react';
import prisma from '../../../utils/prisma';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if(req.method === 'PUT'){
        try{
            const taskData = {
                title: req.body.title, 
                details: req.body.details, 
                completed: req.body.completed, 
                dueDate: req.body.dueDate, 
                start: req.body.start, 
                end: req.body.end,
                priority: req.body.priority, 
                category: req.body.categoryId !== '' && req.body.categoryId !== null 
                    ? { connect: {id: req.body.categoryId } } 
                    : undefined, 
                reminders: req.body.reminders,
                subtasks: req.body.subtasks,
            }
    
            const task = await prisma.task.update({
                where: { id: req.query.id },
                data: taskData
            });

            res.status(201).json(task);
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