import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if(req.method === 'POST'){
        try{         
            const taskData = {
                owner: { connect: {id: req.body.ownerId } },
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

            const task = await prisma.task.create({
                data: taskData
            });
    
            res.status(201).json(task);
        } catch (e) {
            console.log("FUCKING ERROR", e);
            res.status(500).json({error: e});
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res
            .status(405)
            .json({message: `HTTP method ${req.method} not allowed!`});
    }
}