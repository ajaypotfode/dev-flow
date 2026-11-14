"use client"
import { ComponentType, createContext, ReactNode, useContext, useState } from "react";
import ReactDom from 'react-dom'


export interface ModalComponentType<T = any, P = any> {
    props: P,
    close: (result: T) => void
}

export interface DynamicModalType {
    openDynamicModal: <T, P>(
        Component: ComponentType<ModalComponentType<T, P>>,
        props: P
    ) => Promise<T>
}

const DynamicModalContext = createContext<DynamicModalType | undefined>(undefined);

export const useDynamicModal = () => {
    const context = useContext(DynamicModalContext);

    if (!context) {
        throw new Error('useDynamicModal must be used within DynamicModalProvider');
    }
    return context;
}

export const DynamicModalProvider = ({ children }: { children: ReactNode }) => {
    const [modals, setModals] = useState<
        Array<{
            Component: ComponentType<any>,
            props: any,
            resolve: (value: any) => void
        }>
    >([]);

    const openDynamicModal = <T, P>(
        Component: ComponentType<ModalComponentType<T, P>>,
        props: P
    ): Promise<T> => {
        return new Promise((resolve) => {
            setModals((prev) => [...prev, { Component, props, resolve }])
        })
    };

    const closeModal = (result: any) => {
        setModals((prev) => {
            if (prev.length === 0) return prev;
            const lastModal = prev[prev.length - 1];
            lastModal.resolve(result);
            return prev.slice(0, -1);
        });
    }

    return (
        <DynamicModalContext.Provider value={{ openDynamicModal }}>
            {children}
            {
                modals.map(({ Component, props }, index) =>
                    ReactDom.createPortal(
                        <Component key={index} props={props} close={closeModal}></Component>,
                        document.body
                    )
                )
            }
        </DynamicModalContext.Provider>
    )
};