export type ToastType = 'success' | 'pending' | 'error' | 'info'

const styles = {
    success: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-700'
    },
    pending: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-700'
    },
    error: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-700'
    },
    info: {
        bg: 'bg-violet-50',
        text: 'text-violet-700',
        badge: 'bg-violet-100 text-violet-700'
    }
}


export const ToastContainer = ({ message, type }: { message: string, type: ToastType }) => {
    const s = styles[type]

    return (
        <div className=" fixed top-10 right-2 z-50 space-y-3">
            <div
                className={`
        ${s.bg} ${s.text} flex items-center gap-3 px-5 py-4 rounded-2xl shadow-md min-w-[280px] animate-slideUp`}
            >
                <div className={`w-3 h-3 rounded-full ${s.badge}`} />
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    )
}