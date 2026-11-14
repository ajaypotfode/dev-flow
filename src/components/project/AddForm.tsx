
import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog'
import { Plus, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
// import ProjectsMembersForm from './projectMembersForm'
import { Project, ProjectPayload } from '@/src/type/projects'
import { Team } from '@/src/type/user'
import apiClient from '@/src/axios/axios'
import { ModalComponentType } from '@/src/context/dynamicModal'
import { createProject } from '@/src/features/projects/action'
import { useRouter } from 'next/navigation'

interface Result {
    isError: boolean;
    message?: string;
}

// interface ProjectFormProps {
//     // setProjectData: (projectData: ProjectPayload) => void;
//     // projectData: ProjectPayload;
//     // updateProject: ProjectPayload | null;
//     // submit: (projectData: ProjectPayload) => void
// }

const AddForm: React.FC<ModalComponentType<Result, null>> = ({ close }) => {
    const [projectData, setProjectData] = useState<ProjectPayload>({
        title: '',
        description: '',
        deadline: '',
        status: '',
        members: [],
        githubUrl: '',
        projectColor: ''
    });

    const [members, setMembers] = useState<Team[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();



    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get(`/api/team`);
            setMembers(response.data.team)
            setLoading(false);
            console.log("response is  :", response);

        } catch (error) {
            setLoading(false)
            console.log("error  :", error);
        }

    };


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData()
    }, []);




    const submitProject = async (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();

        const isValid =
            projectData.title.trim() !== "" &&
            projectData.deadline !== "" &&
            projectData.members.length > 0 &&
            projectData.status.trim() !== "";

        if (!isValid) {
            // show error
            setError("Please fill in all required fields.");
            return;
        }

        const payload = {
            title: projectData.title,
            deadline: new Date(projectData.deadline),
            ...(projectData.description && { description: projectData.description }),
            status: projectData.status,
            members: projectData.members,
            ...(projectData.githubUrl && { githubUrl: projectData.githubUrl }),
            ...(projectData.projectColor && { projectColor: projectData.projectColor }),
        }
        // console.log("project color  :", payload);
         setLoading(true);
        const response = await createProject(payload);
        // setProjects([...projects, response.data.project])
        setLoading(false);

        if (!response.error) {
            close({ isError: false, message: "Project Created Successfully!!" });

            router.refresh();
            return;
        }
        close({ isError: true, message: response.error });
        // setOpenForm(false)

    };


    const addMembers = (id: string) => {
        const checkId = projectData.members.find(m => m.id === id);
        if (checkId) return;

        setProjectData({
            ...projectData,
            members: [...projectData.members, { id: id }]
        })
    }

    const removeMember = (id: string) => {
        const newMembers = projectData.members.filter(m => m.id !== id);

        setProjectData({ ...projectData, members: newMembers })
    }


    const PROJECT_COLORS = [
        "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6", "#F97316",
    ];
    // console.log("child");


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-700/50 backdrop-blur-sm"
                onClick={() => close({ isError: true, })}
            />

            <div className="bg-background p-6 rounded-lg
            shadow-lg z-10 max-w-sm w-full">
                <div className="flex justify-between items-center">
                    <h3 className="text-foreground text-xl font-bold mb-2">
                        Add Project
                    </h3>
                    <button onClick={() => close({ isError: true, })}>
                        <X className="w-6 h-6 drop-shadow
                        text-foreground cursor-pointer"></X>
                    </button>
                </div>

                {
                    error && <p className='text-red-600 '>{error}</p>
                }

                <form className="space-y-4 py-2" onSubmit={submitProject}>
                    <div className="space-y-1.5">
                        <Label>Name<span className="text-destructive">*</span></Label>
                        <Input
                            placeholder="Project name"
                            value={projectData.title}
                            onChange={e => setProjectData({ ...projectData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Description</Label>
                        <Input placeholder="Short description"
                            value={projectData.description}
                            onChange={e => setProjectData({ ...projectData, description: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="flex items-center gap-1.5">
                            {/* <Git className="h-3.5 w-3.5" /> */}
                            GitHub Repo URL</Label>
                        <Input placeholder="https://github.com/org/repo"
                            value={projectData.githubUrl}
                            onChange={e => setProjectData({ ...projectData, githubUrl: e.target.value })}
                        />
                    </div>
                    <div className="grid  sm:grid-cols-2 grid-cols-1 gap-3">
                        <div className="space-y-1.5">
                            <Label>Status <span className="text-destructive">*</span></Label>
                            <Select
                                value={projectData.status}
                                onValueChange={e => setProjectData({ ...projectData, status: e })}
                            >
                                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="complete">Complete</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Add Member <span className="text-destructive">*</span></Label>
                            <Select
                                onValueChange={v => addMembers(v)}
                            >
                                <SelectTrigger><SelectValue placeholder="Select members" /></SelectTrigger>
                                <SelectContent>
                                    {/* { */}
                                    <>
                                        <SelectItem defaultChecked value={'select Member'}>Select Member</SelectItem>
                                        {members.map((member, index) => (
                                            <SelectItem key={index} value={member.id}>{member.name}</SelectItem>
                                        ))}
                                    </>
                                    {/* } */}
                                    {/* <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="paused">Paused</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem> */}
                                </SelectContent>
                            </Select>


                            {projectData.members.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {projectData.members.map(pm => {
                                        const m = (members ?? []).find(m => m.id === pm.id);
                                        if (!m) return null;
                                        return (
                                            <span key={pm.id} className="inline-flex items-center gap-1 bg-muted text-xs rounded-full pl-2 pr-1 py-0.5">
                                                {m.name}
                                                <button onClick={() => removeMember(m.id)}
                                                    className="hover:text-destructive transition-colors">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Deadline <span className="text-destructive">*</span></Label>
                        <Input type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={projectData.deadline as string}
                            onChange={e => setProjectData({ ...projectData, deadline: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Color</Label>
                        <div className="flex gap-2 flex-wrap">
                            {PROJECT_COLORS.map(c => (
                                <button key={c}
                                    type='button'
                                    onClick={() => setProjectData({ ...projectData, projectColor: c })}
                                    className={`w-7 h-7 rounded-md transition-all
                                            ${projectData.projectColor === c ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" : "hover:scale-105"}
                                       `}

                                    style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    </div>
                    <Button
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating...." : "Create Project"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default AddForm