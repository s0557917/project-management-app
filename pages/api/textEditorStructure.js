import { getSession } from "next-auth/react";
import {prisma} from "../../utils/prisma";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if(req.method === 'PUT' && session){
        try{

            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });

            let updatedTextEditorStructure = user.textEditorStructure; 
            
            if(req.body.action === 'delete'){
                const updatedTaskId = req.body.taskId;
                const deleteIdIndex = updatedTextEditorStructure.findIndex(task => task.id === updatedTaskId);
                console.log("ID", updatedTaskId);
                console.log("deleteIdIndex: ", deleteIdIndex);
                console.log('updatetajk', updatedTextEditorStructure);

                updatedTextEditorStructure = updatedTextEditorStructure
                    .filter(line => {
                        if(line.id !== updatedTaskId){
                            return true;
                        } else {
                            return false;
                        }
                    })
                    .map((line, index) => {
                        if(index > deleteIdIndex){
                            return {
                                ...line, 
                                startPos: {'c': line.startPos.c, 'l': line.startPos.l - 1},
                                endPos: {'c': line.endPos.c, 'l': line.endPos.l - 1},
                            }
                        } else {
                            return line;
                        }
                    });

                console.log("DELETE AFTER", updatedTextEditorStructure);
            } else if(req.body.action === 'add'){
                const updatedTaskId = req.body.taskId;
                const lastLine = updatedTextEditorStructure.sort((a, b) => b.endPos.l - a.endPos.l)[0].endPos.l;

                updatedTextEditorStructure.push({
                    id: updatedTaskId,
                    startPos: {
                        l: lastLine + 1,
                        c: 0
                    },
                    endPos: {
                        l: lastLine + 1,
                        c: 0
                    },
                    content: ''
                });
            } else if(req.body.action === 'update'){
                updatedTextEditorStructure = req.body.structure;
            }

            const textEditorStructure = await prisma.user.update({
                where: { email: session.user.email },
                data: {
                    name: undefined,
                    email: undefined,
                    email_verified: undefined,
                    password: undefined,
                    image: undefined,
                    settings: undefined,
                    textEditorStructure: updatedTextEditorStructure
                }
            });
            
            res.status(201).json(textEditorStructure);
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