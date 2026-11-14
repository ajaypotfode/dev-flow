"use client"

import { ErrorState } from "@/src/components/states/errorState";
import { useEffect } from "react"

export default function ProjectPageError(
    { error, reset }: {
        error: Error & { digest?: string },
        reset: () => void
    }
) {

    useEffect(() => {
        console.error(error)
    }, [error]);

    return <ErrorState onRetry={reset} />

}

