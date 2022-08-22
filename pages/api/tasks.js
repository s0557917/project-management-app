import { getSession } from 'next-auth/react';
import prisma from '../../utils/prisma';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if(req.method === 'POST' && session){
        try{         
            const taskData = {
                owner: { connect: { email: session?.user?.email } },
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

            const task = await prisma.task.create({
                data: taskData
            });
    
            res.status(201).json(task);
        } catch (e) {
            res.status(500).json({error: e});
        }
    } else if(req.method === 'GET' && session){
        try {
            const tasks = await prisma.task.findMany({
                where: {
                    owner: { email: session?.user?.email },
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