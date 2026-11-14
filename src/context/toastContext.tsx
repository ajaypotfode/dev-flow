"use client";
import { createContext, useContext, useState } from "react";
import ReactDom from 'react-dom';
import { ToastContainer, ToastType } from "../components/custome/toast";
// import { ToastContainer, type ToastType } from "../components/toaster";



interface DynamicToastModal {
    openToast(
        message: string,
        type: ToastType
    ): Promise<unknown>
}

const ToastModalContext = createContext<DynamicToastModal | undefined>(undefined);

export const useToastModal = () => {
    const context = useContext(ToastModalContext);
    if (!context) {
        throw new Error('Add Toast Context')
    }
    return context
}


const ToastModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<Array<{
        // Component: ComponentType<{ message: string, type: string }>,
        props: { message: string, type: ToastType },
        resolve: (value: boolean) => void,
        id: string;
    }>>([])


    const closeToast = (result: boolean, id: string) => {
        setToast((prev) => {
            const toast = prev.find(toast => toast.id === id)
            if (!toast) return prev;
            toast.resolve(result);
            return prev.filter(toast => toast.id !== id)
        })

    }

    const openToast = (message: string, type: ToastType) => {
        const id = Math.random().toString(36).slice(2);
        return new Promise((resolve) => {
            setToast((prev) => [
                ...prev,
                {
                    id,
                    // Component: ToastContainer,
                    props: { message, type },
                    resolve
                }])

            setTimeout(() => {
                closeToast(true, id)
            }, 2000)
        })
    }

    return (
        <ToastModalContext.Provider value={{ openToast }}>
            {children}
            {
                toast.map(({ props, id }) => (
                    ReactDom.createPortal(
                        <ToastContainer {...props} key={id} />,
                        document.body
                    )
                ))
            }
        </ToastModalContext.Provider>
    )

}

export default ToastModalProvider