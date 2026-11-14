"use client"

import React, { useEffect, useEffectEvent, useState } from 'react'
import { Calendar, Eye, MessageSquare, Send, X } from 'lucide-react';

import { Task } from '@/src/type/task';
import apiClient from '@/src/axios/axios';
import { ModalComponentType } from '@/src/context/dynamicModal';
import { useSocket } from '@/src/context/socketConnection';
import { getCurrentUser } from '@/src/features/auth/action';
import { Message, MessagePayload } from '@/src/type/message';
import { chatConnection } from '@/src/lib/connectSocket';



interface TaskDetailsProps {
    taskDetails: Task;
    currentUser: string;
}

const TaskDetailsComponent: React.FC<ModalComponentType<null, TaskDetailsProps>> = ({ props, close }) => {
    const { taskDetails, currentUser } = props;
    // const [comment, setComment] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [commentsLoading, setCommentsloading] = useState(false);

    const { userStatuses } = useSocket();


    const fetcMessages = async (taskId: string) => {
        setCommentsloading(true)
        try {
            const response = await apiClient.get(`/api/message?taskId=${taskId}`);
            setMessages(response.data.messages);
            setCommentsloading(false);
            // console.log("response is  :", response);

        } catch (error) {
            setCommentsloading(false)

        }

    };

    // console.log("render task-details page Page.....");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetcMessages(taskDetails.id);
    }, [])


    // handles user Status Socket connection

    //    useEffect(() => {
    //     const handleUserStatus = (data: {
    //         userId: string;
    //         status: string;
    //     }) => {
    //         console.log("Received user status:", data);
    //     };

    //     presenseSocket.on("user:status", handleUserStatus);

    //     return () => {
    //         presenseSocket.off("user:status", handleUserStatus);
    //     };
    // }, [presenseSocket]);


    // handles chat Socket Connection
    useEffect(() => {

        if (!chatConnection || !taskDetails.id) return;

        const chatId = taskDetails.id;

        const joinRoom = () => {
            console.log("Joining chat room:", chatId);

            chatConnection.emit("chat-room", {
                chatId,
                userName: currentUser,
            });
        };

        const handleMessage = ({
            message,
            id,
            createdAt,
            updatedAt,
            sender,
            taskId,
        }: {
            id: string;
            message: string;
            createdAt: string;
            updatedAt: string;
            sender: {
                name: string;
                id: string;
            };
            taskId: string;
        }) => {
            // Avoid displaying messages belonging to another task.
            if (taskId !== chatId) return;

            setMessages((prev) => [
                ...prev,
                {
                    id,
                    message,
                    createdAt,
                    updatedAt,
                    sender,
                    taskId,
                },
            ]);
        };

        const handleConnectError = (error: Error) => {
            console.error("Chat socket connection error:", error.message);
        };

        const handleDisconnect = (reason: string) => {
            console.log("Chat disconnected:", reason);
        };

        chatConnection.on("connect", joinRoom);
        chatConnection.on("message", handleMessage);
        chatConnection.on("connect_error", handleConnectError);
        chatConnection.on("disconnect", handleDisconnect);

        if (!chatConnection.connected) {
            chatConnection.connect();
        } else {
            joinRoom();
            //it handles imediates effect if socket connected
            // use full when  switching chat Rooms
        }

        return () => {
            chatConnection.off("connect", joinRoom);
            chatConnection.off("message", handleMessage);
            chatConnection.off("connect_error", handleConnectError);
            chatConnection.off("disconnect", handleDisconnect);
            // presenseSocket.off("c")

            // Disconnect when leaving the chat page.
            chatConnection.disconnect();
        };

    }, [chatConnection, taskDetails.id, currentUser]);



    // const commentsLoading = false;
    const PRIORITY_KEY = taskDetails.priority as 'low' | 'medium' | 'high'

    const PRIORITY_CONFIG = {
        low: {
            label: "Low",
            bg: "bg-green-100 text-green-700 border-green-200",
        },
        medium: {
            label: "Medium",
            bg: "bg-yellow-100 text-yellow-700 border-yellow-200",
        },
        high: {
            label: "High",
            bg: "bg-red-100 text-red-700 border-red-200",
        },
    };

    const COLUMNS = [
        {
            id: "todo",
            label: "To Do",
        },
        {
            id: "in_progress",
            label: "In Progress",
        },
        {
            id: "done",
            label: "Done",
        },
    ];

    const getInitials = (name = "Manohar Gurav") =>
        name
            .slice(0, 1)
            .toUpperCase();



    const sendMessages = async (messagePayload: MessagePayload) => {
        try {
            const response = await apiClient.post(`/api/message`, messagePayload);
            // setMessages(response.data.messages);
            // setCommentsloading(false);
            // console.log("response is  :", response);
            // setInputValue("");

        } catch (error) {
            // setCommentsloading(false)
            // setInputValue("");
            console.log("error  :", error);
        }
    }

    const handleSendComment = async () => {
        if (!chatConnection.connected || !inputValue.trim()) return;
        // getCurrentUserName(chatConnection, "hello user", taskDetails.id);

        if (!chatConnection.connected) {
            console.log("Socket is not connected");
            return;
        }

        if (!taskDetails?.id) {
            console.log("Task ID is missing");
            return;
        }

        try {
            const user = await getCurrentUser();

            const messagePayload = {
                message: inputValue,
                senderName: user.name,
                taskId: taskDetails.id,
                senderId: user.id,
            }


            chatConnection.emit("message", messagePayload, (response: {
                success: boolean,
                error?: string
            }) => {
                if (!response?.success) {
                    console.log("message Error :", response.error);
                    return;
                }

                setInputValue("");
            });
            // api call 
            await sendMessages({
                message: inputValue,
                taskId: taskDetails.id,
                senderId: user.id,
            });
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };


    // const memberStatus = userStatuses[taskDetails.member.id]??"";

    const getMemberStatus = (id: string) => userStatuses[id] ?? ""

    return (
        <>

            <div className="fixed inset-0 z-50">
                <div
                    className=" absolute inset-0 bg-black/40 backdrop-blur-[1px] "
                    onClick={() => close(null)}
                />
                <div
                    className=" absolute right-0 top-0 h-screen w-full sm:max-w-lg bg-white dark:bg-gray-950 shadow-2xl flex flex-col animate-in slide-in-from-right  "
                >
                    <div
                        className=" px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 "
                    >
                        <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">
                                <h2
                                    className=" text-base font-semibold leading-snug text-gray-900 dark:text-gray-100"
                                >
                                    {taskDetails.task}
                                </h2>

                                {taskDetails.project?.title && (
                                    <p
                                        className=" text-xs text-gray-500 dark:text-gray-400 mt-1"
                                    >
                                        {taskDetails.project.title}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => close(null)}
                                className=" flex-shrink-0 h-8 w-8 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-900
                                         hover:bg-gray-100 dark:hover:bg-gray-800 transition "
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>

                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="px-6 py-4 space-y-5">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p
                                        className=" text-xs text-gray-500 dark:text-gray-400 mb-1"
                                    >
                                        Status
                                    </p>

                                    <span
                                        className=" inline-flex items-center rounded-md border border-gray-200 dark:border-gray-700
                                                             px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300  "
                                    >
                                        {COLUMNS.find(
                                            (c) => c.id === taskDetails.status
                                        )?.label ?? taskDetails.status}
                                    </span>
                                </div>

                                {/* Priority */}
                                <div>
                                    <p
                                        className=" text-xs text-gray-500 dark:text-gray-400 mb-1"                            >
                                        Priority
                                    </p>

                                    <span
                                        className={` inline-flex items-center rounded-md border px-2 py-0.5 text-xs
                        ${PRIORITY_CONFIG[PRIORITY_KEY]?.bg ?? "bg-gray-50 text-gray-700 border-gray-200"}  `}
                                    >
                                        {PRIORITY_CONFIG[PRIORITY_KEY]?.label ??
                                            taskDetails.priority}
                                    </span>
                                </div>

                                {/* Assignee */}
                                {taskDetails.member && (
                                    <div>
                                        <p
                                            className=" text-xs text-gray-500 dark:text-gray-400 mb-1 "
                                        >
                                            Assignee
                                        </p>

                                        <div className="flex items-center gap-2">

                                            <div
                                                className=" h-5 w-5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"
                                            >
                                                {taskDetails.member.image ? (
                                                    <img
                                                        src={taskDetails.member.image}
                                                        alt={taskDetails.member.name}
                                                        className=" h-full w-full object-cover "
                                                    />
                                                ) : (
                                                    <span
                                                        className=" text-[9px] font-medium text-gray-500 dark:text-gray-400 "   >
                                                        {getInitials(taskDetails.member.name)}
                                                    </span>
                                                )}
                                            </div>

                                            <span className="text-xs text-gray-800 dark:text-gray-200">
                                                {taskDetails.member.name}
                                                <span className={`${getMemberStatus(taskDetails.member.id) == "online" ? "text-emerald-500" : "text-muted-foreground"} block `}>
                                                    {getMemberStatus(taskDetails.member.id)}
                                                </span>
                                            </span>


                                        </div>
                                    </div>
                                )}

                                {/* Due Date */}
                                {taskDetails.dueDate && (
                                    <div>
                                        <p
                                            className=" text-xs text-gray-500 dark:text-gray-400 mb-1"
                                        >
                                            Due Date
                                        </p>

                                        <span className="text-xs flex items-center gap-1 text-gray-800 dark:text-gray-200">
                                            <Calendar className="h-3 w-3" />

                                            {new Date(
                                                taskDetails.dueDate
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {taskDetails?.description && (
                                <div>
                                    <p className="text-xs font-medium mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Description
                                    </p>

                                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                        {taskDetails.description}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-xs font-medium mb-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <MessageSquare className="h-3 w-3" />
                                    Comments
                                </p>

                                {commentsLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2].map((item) => (
                                            <div
                                                key={item}
                                                className="h-16 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : (messages ?? []).length === 0 ? (
                                    /* Empty */
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                                        No comments yet.
                                    </p>
                                ) : (
                                    /* Comments List */
                                    <div className="space-y-3">
                                        {(messages ?? []).map((c) => (
                                            <div
                                                key={c.id}
                                                className="flex gap-3  relative"
                                            >
                                                {/* Avatar */}
                                                <div className=" h-7 w-7 rounded-full overflow-hidden flex-shrink-0 mt-0.5 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                    {/* {c?.authorAvatar ? (
                                                        <img
                                                            src={
                                                                c.authorAvatar
                                                            }
                                                            alt={
                                                                c.authorName
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : ( */}
                                                    <span className="text-[9px] font-medium text-gray-600 dark:text-gray-300">
                                                        {getInitials(
                                                            c.sender.name
                                                        )}
                                                    </span>
                                                    {/* )} */}
                                                </div>
                                                {getMemberStatus(c.sender.id) == "online" && <span className="absolute -top-0.5 -left-0.5 w-3.5 h-3.5 rounded-full border-2 border-card bg-emerald-500"/>}



                                                    {/* Comment Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                                                {
                                                                    c.sender.name
                                                                }
                                                            </span>

                                                            <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                                {new Date(
                                                                    c.createdAt
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>

                                                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                                            {c.message}
                                                        </p>
                                                    </div>
                                                </div>
                                        ))}
                                            </div>
                                        )}
                                    </div>
                        </div>
                        </div>

                        {/* Comment Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                            <div className="flex gap-2">
                                <textarea
                                    placeholder="Add a comment… (Ctrl+Enter to send)"
                                    className="flex-1 min-h-[64px] resize-none rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
                                    value={inputValue}
                                    onChange={(e) =>
                                        // setComment(e.target.value)
                                        setInputValue(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            (e.metaKey || e.ctrlKey)
                                        ) {
                                            handleSendComment();
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={handleSendComment}
                                    disabled={!inputValue.trim()}
                                    className="self-end h-9 w-9 flex items-center justify-center rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* )} */}
            </>
            );
}

            export default TaskDetailsComponent