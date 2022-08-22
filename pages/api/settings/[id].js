import { getSession } from 'next-auth/react';
import prisma from '../../../utils/prisma';

//TODO ENSURE NO WRONG SETTINGS ARE STORED
export default async function handler(req, res) {
    const session = await getSession({ req });
    if(req.method === 'PUT' && session){
        try{
            const updatedSettings = {
                theme: req.body.theme || 'dark',
                filters: req.body.filters || [[{name: Uncategorized,value: true},{name: Completed,value: true}]],
                defaultView: req.body.defaultView || 'task-list',
            }

            const category = await prisma.user.update({
                where: { email: session.user.email },
                data: {
                    name: undefined,
                    email: undefined,
                    email_verified: undefined,
                    password: undefined,
                    image: undefined,
                    settings: updatedSettings,
                }
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