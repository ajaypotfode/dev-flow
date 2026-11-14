
import { ArrowDown, ArrowUp, ChevronsUp, LucideIcon, Minus, Plus } from 'lucide-react';
import { requireSession } from '@/src/lib/require_session';
import { CreateTaskButton } from '@/src/components/task/actionButtons';
import TaskCard from '@/src/components/task/taskCard';
import { taskListService } from '@/src/services/tasks';
import Link from 'next/link';
import Pagination from '@/src/components/custome/pagination';

const Tasks = async ({ searchParams }: {
    searchParams: Promise<{
        status?: "completed" | "pending" | "active";
        direction?: "next" | "prev";
        pageNum: string;
    }>
}) => {



    const session = await requireSession();
    const params = await searchParams;
    const pageSize = 10;
    const currentPage = params.pageNum ? Number(params.pageNum) : 1;

    const { allTask, total } = await taskListService({
        status: params.status,
        pageNum: currentPage,
        pageSize
    });


    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const pageSortLink = (pageNum: number) => {
        const qs = new URLSearchParams();
        if (params.status) qs.set('status', params.status);
        qs.set('pageNum', String(pageNum))
        return `/tasks?${qs.toString()}`
    }


    const COLUMNS = [
        // { id: "todo", label: "Todo", color: "#9CA3AF" },
        { id: "active", label: "In Progress", color: "#F59E0B" },
        { id: "pending", label: "pending", color: "#3B82F6" },
        { id: "completed", label: "Done", color: "#10B981" },
    ];

    const PRIORITY_CONFIG: Record<string, { label: string; icon: LucideIcon; color: string; bg: string }> = {
        urgent: { label: "Urgent", icon: ChevronsUp, color: "text-red-500", bg: "bg-red-500/10 text-red-500 border-red-500/20" },
        high: { label: "High", icon: ArrowUp, color: "text-orange-500", bg: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
        medium: { label: "Medium", icon: Minus, color: "text-blue-500", bg: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
        low: { label: "Low", icon: ArrowDown, color: "text-muted-foreground", bg: "bg-muted text-muted-foreground border-muted" },
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground mt-1">4 total tasks across all projects</p>
                </div>
                <div className="flex items-center gap-2">
                    {(session.role === 'admin' || session.role === 'leader') && <CreateTaskButton />}
                </div>
                {/* <Dialog>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" />New Task</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                        </DialogHeader>

                        <TaskForm
                            submit={submitTask}
                            taskStatus={COLUMNS}
                        />
                    </DialogContent>
                </Dialog> */}
            </div>

            {/* <Tabs value={currentTab} onValueChange={(e) => setCurrentTab(e)} className="w-[100%]"> */}
            <div className="flex w-full items-center gap-1 border-b border-border">
                {COLUMNS.map((col) => {
                    const isActive = (params.status ?? "active") === col.id;

                    return (
                        <button
                            key={col.id}
                            type="button"
                            // onClick={() => setCurrentTab(col.id)}
                            className={`
                            relative flex items-center gap-2
                            px-4 py-3
                            text-sm font-semibold
                            transition-colors
                            focus:outline-none
                            ${isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }
                        `}
                        >
                            <Link href={`/tasks?status=${col.id}`}>
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: col.color }}
                                />

                                {/* Label */}
                                <span>{col.label}</span>

                                {/* Optional count */}
                                {/*
                        <span className="ml-1 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {tasksByStatus(col.id).length}
                        </span>
                        */}

                                {/* Active indicator */}
                                {isActive && (
                                    <span
                                        className="absolute inset-x-0 bottom-0 h-0.5"
                                        style={{ backgroundColor: col.color }}
                                    />
                                )}
                            </Link>

                        </button>
                    );
                })}
            </div>


            <div className="grid grid-cols-1 gap-4 min-h-[600px]">
                <div className="flex-1 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-x-4 space-y-2.5 h-fit overflow-y-auto">

                    {
                        allTask.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                priorityConfig={PRIORITY_CONFIG}
                                currentUser={session.userName}

                            />

                        ))
                    }
                </div>
                <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    pageLink={pageSortLink}
                />
                {/* <div className='flex gap-3'>
                {currentPage > 1 ? <button >
                    <Link href={pageSortLink(currentPage - 1)}>Prev</Link>
                </button> : <button>
                    Prev
                </button>}
                {currentPage < totalPages ? <button>
                    <Link href={pageSortLink(currentPage + 1)}>Next</Link>
                </button> : <button>Next</button>}
            </div> */}
            </div>


            {/* </TabsContent> */}
            {/* </Tabs> */}

        </div>

    )
}

export default Tasks