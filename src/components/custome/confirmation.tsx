"use client"
import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { ModalComponentType } from '@/src/context/dynamicModal';
import { Delete, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Confirmationparams {
    title: string,
    description: string;
    contentName: string;
}

interface Result {
    isError: boolean;
    message?: string;
}

const Confirmation: React.FC<ModalComponentType<Result, Confirmationparams>> = ({ close, props }) => {
    const { title, description, contentName } = props;
    const [confirmtext, setConfirmtext] = useState("");
    const [error, setError] = useState("");

    console.log("Modal get called");

    const confirmDeletetask = () => {

        if (confirmtext == contentName) {
            close({ isError: false });
            return;
        }
        setError("Please Enter Proper Name")

    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-700/50 backdrop-blur-sm"
                onClick={() => close({ isError: true, })}
            />
            <Card className="group relative hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer overflow-hidden">
                {/* <div className="h-1.5 absolute top-0 right-0 left-0 w-full"  /> */}
                <CardContent className="relative ">
                    <div className="min-w-0">
                        <div className='flex gap-x-4 items-center mb-4'>
                            <div className='p-3 bg-red-600/50 rounded-2xl'>
                                <Trash2 className='w-8 h-8 text-red-500' />
                            </div>
                            <h3 className="font-semibold text-2xl truncate">{title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-normal mt-0.5 line-clamp-2">
                            {description}
                        </p>

                        <p className='text-sm mt-5 mb-3 text-muted-foreground  line-clamp-2 '>
                            Type <span className='font-bold'>{contentName}</span> to Confirm
                        </p>
                        <Input
                            placeholder={contentName}
                            value={confirmtext}
                            onChange={e => { setConfirmtext(e.target.value); if (error.trim() !== "") setError(""); }}
                        />
                        {
                            <p className='text-red-600 '>{error}</p>
                        }

                        <div className='mt-4 flex gap-x-3  w-fit ms-auto'>
                            <Button
                                onClick={() => close({ isError: true })}
                            >
                                Cancel
                            </Button>

                            <Button
                                className='bg-red-600'
                                onClick={confirmDeletetask}
                                type='button'
                            >
                                Delete

                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

export default Confirmation