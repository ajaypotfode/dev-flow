import { messageValidation } from "@/src/features/message/messageSchema";
import prisma from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/require_session";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const taskId = req.nextUrl.searchParams.get('taskId');

        if (!taskId) {
            return NextResponse.json({ message: "Add TaskId first", success: false });
        }

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

        return NextResponse.json({ message: "messages Fetched Successfully", success: true, messages: messages })

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To fetch messages", success: false, error: err }, { status: 500 })
    }
}


export const POST = async (req: NextRequest) => {
    try {

        await requireSession();

        const body = await req.json();

        const { message, senderId, taskId, image, file, } = body;

        const validation = messageValidation(body);

        // Validation failed
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: validation.message
                },
                { status: 400 }
            )
        }

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

        return NextResponse.json({ message: "message Send Successfully", success: true, user: newMessage }, { status: 200 });

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"
        return NextResponse.json({ message: "Failed To send Message", success: false, error: err }, { status: 500 });
    }

}