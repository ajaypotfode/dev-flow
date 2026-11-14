// "use client"
import { Input } from '@/src/components/ui/input'
import ProjectCard from '@/src/components/project/projectCard'
import { getProjectListService } from '@/src/services/projects'
import { CreateProjectButton } from '@/src/components/project/actionButtons'
import { requireSession } from '@/src/lib/require_session'
import { Button } from '@/src/components/ui/button'
import Pagination from '@/src/components/custome/pagination'
import Link from "next/link";
import { handleSearch } from '@/src/features/projects/action'

const ProjectsPage = async ({ searchParams }: {
    searchParams: Promise<{
        q?: string;
        status?: "complete" | "pending" | "active" | "all";
        pageNum: string;
    }>
}) => {
    // const isLoading = false;
    const session = await requireSession();
    const params = await searchParams;
    const pageSize = 9;

    const currentPage = params.pageNum ? Number(params.pageNum) : 1;

    const { projects, total } =
        await getProjectListService({
            ...(params.q && { q: params.q }),
            status: params.status,
            pageNum: currentPage,
            pageSize
        });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));



    const pageSortLink = (pageNum: number) => {
        const qs = new URLSearchParams();
        if (params.q) qs.set("q", params.q);
        if (params.status) qs.set('status', params.status);
        qs.set('pageNum', String(pageNum))
        return `/projects?${qs.toString()}`
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-1">Manage your projects, track progress, and keep your team on track..</p>
                </div>
                <div className="flex items-center gap-2">
                    {(session.role === 'admin' || session.role === 'leader') && <CreateProjectButton />}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <form
                        // Submit the form to the projects page.
                        // Form values become URL query parameters.
                        // Example: /projects?q=react&status=active
                        action={handleSearch}

                        className="flex gap-3"
                    >
                        {/* <div className="flex gap-3"> */}
                        <Input
                            name="q" //your name should be same as query params
                            defaultValue={params.q ?? ""}
                            placeholder="Search projects..."
                        />

                        <select
                            name="status" //your name should be same as query params
                            defaultValue={params.status ?? "all"}
                            className='bg-transparent'
                        >
                            <option className='bg-input' value="all">All Status</option>
                            <option className='bg-input' value="active">Active</option>
                            <option className='bg-input' value="pending">Paused</option>
                            <option className='bg-input' value="complete">Completed</option>
                        </select>

                        <Button type="submit">
                            Search
                        </Button>
                    </form>
                    {/* </div> */}

                </div>
            </div>

            {
                // isLoading ? (
                //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                //         {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-60 rounded-xl" />)}
                //     </div>
                // )
                //  : filtered.length === 0 ? (
                //     <div className="flex flex-col items-center justify-center py-24 text-center">
                //         <FolderKanban className="h-12 w-12 text-muted-foreground/30 mb-4" />
                //         <h3 className="text-lg font-semibold">No projects found</h3>
                //         <p className="text-muted-foreground text-sm mt-1">Create your first project to get started.</p>
                //     </div>
                // ) 
                // : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map(project => {
                        return (<ProjectCard
                            key={project.id}
                            project={project}
                        // deleteProject={deleteProject}
                        // changeStatus={changeStatus}
                        // handleUpdate={handleUpdateProject}
                        />);
                    })}
                </div>
                // )
            }
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

        </div >
    )
}

export default ProjectsPage