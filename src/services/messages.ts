import prisma from "../lib/prisma";
import { MessagePayload } from "../type/message";

export const getMessagesService = async (taskId: string) => {

    const messages = await prisma.message.findMany(
        {
            where: {
                taskId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        // sddssd:true,
                    }
                }
            }
        }
    );

    return messages

};



export const createMessageService = async (messagePayload: MessagePayload) => {
    const { message, senderId, taskId, image, file, } = messagePayload;
    const newMessage = await prisma.message.create({
        data: {
            message,
            senderId,
            taskId,
            image,
            file

        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    return newMessage

}
