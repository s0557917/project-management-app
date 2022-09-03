import { getSession } from "next-auth/react";
import {prisma} from "../../utils/prisma";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if(req.method === 'PUT' && session){
        try{
            const settings = await prisma.user.update({
                where: { email: session.user.email },
                data: {
                    name: undefined,
                    email: undefined,
                    email_verified: undefined,
                    password: undefined,
                    image: undefined,
                    settings: undefined,
                    textEditorStructure: req.body
                }
            });
            
            res.status(201).json(settings);
        } catch (e) {
            console.log("ERROR", e);
            res.status(500).json({error: e});
        }
    } else if(req.method === 'GET' && session){
        try{
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });

            res.status(200).json(user.textEditorStructure);
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