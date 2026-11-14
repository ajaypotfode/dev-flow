"use server"

import { requireSession } from "@/src/lib/require_session";
import { MessagePayload } from "@/src/type/message";
import { messageValidation } from "./messageSchema";
import { createMessageService, getMessagesService } from "@/src/services/messages";
import { revalidatePath } from "next/cache";
// import { Socket } from "socket.io-client";



export const getMessagesAction=async(taskId:string)=>{
    const session = await requireSession();
    try {
        
const messages=await getMessagesService(taskId);
return messages;

    } catch (error) {
         console.error(error);
        return {
            error: "Failed to create Message.",
        }; 
    }
}

export const sendMessageAction=async(payload:MessagePayload)=>{
     const session = await requireSession();

        const { success, message } = messageValidation(payload);
         if (!success) {
             return { error: message || "Please Check The Form Data" };
         };
     
 try {
        const message = await createMessageService(payload);
        // revalidatePath('/task');
        return { message };

    } catch (error) {
        console.error(error);
        return {
            error: "Failed to create Message.",
        };
    }
}

// export const getMessages=async()=>{
// const session=await requireSession();
// try {
    
// } catch (error) {
    
// }


// }