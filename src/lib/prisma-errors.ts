import { boolean } from "zod";
import { Prisma } from "../prisma/generated/client";

export const isRecordNotFoudError = (error: unknown): boolean => {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
}


export const duplicateError = (error: unknown): boolean => {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
}

export const isMissingRelationError = (error: unknown): boolean => {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003"
}