import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if(req.method === 'PUT'){
        
        const taskData = {
            title: req.body.title, 
            details: req.body.details, 
            completed: req.body.completed, 
            dueDate: req.body.dueDate, 
            start: req.body.start, 
            end: req.body.end,
            priority: req.body.priority, 
            category: req.body.categoryId !== '' ? { connect: {id: req.body.categoryId } } : undefined, 
            reminders: req.body.reminders,
            subtasks: req.body.subtasks,
        }

        const task = await prisma.task.update({
            where: { 
                id: req.query.id 
            },
            data: taskData
        });

        res.status(201).json(task);
    } else {
        res.setHeader('Allow', ['PUT']);
        res
            .status(405)
            .json({message: `HTTP method ${req.method} not allowed!`});
    }
}