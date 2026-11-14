"use client"
import React, { useState } from 'react'
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import { X } from 'lucide-react';
import { ModalComponentType } from '@/src/context/dynamicModal';
import { useRouter } from 'next/navigation';
import { createTeamMemberAction } from '@/src/features/team/action';


interface Result {
    isError: boolean;
    message?: string;
}

// interface TeamFormProps {
//     // setProjectData: (projectData: ProjectPayload) => void;
//     // projectData: ProjectPayload;
//     submit: (userData: UserPayload) => void;
// }

const AddMemberForm: React.FC<ModalComponentType<Result, null>> = ({ close }) => {
    const router = useRouter();
    const [inviteForm, setInviteForm] = useState({
        name: "",
        email: "",
        role: "",
        status: "",
        phone: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const submitMember = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const isValid =
            inviteForm.name.trim() !== "" &&
            inviteForm.email.trim() !== "" &&
            inviteForm.role !== "" &&
            inviteForm.status !== ""

        if (!isValid) {
            // show error
            setError("Please fill in all required fields.");
            return;
        }

        const payload = {
            name: inviteForm.name,
            email: inviteForm.email,
            password: 'Test@123',
            role: inviteForm.role,
            image: '',
            status: inviteForm.status,
            phone: inviteForm.phone
        }
        // console.log("project color  :", payload);
        setLoading(true);
        const response = await createTeamMemberAction(payload);
        // setProjects([...projects, response.data.project])
        // setLoading(false);
        setLoading(false);
        if (!response.error) {
            close({ isError: false, message: "Member Added Successfully!!" });
            router.refresh();
            return;
        }
        close({ isError: true, message: response.error });
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-700/50 backdrop-blur-sm"
                onClick={() => close({ isError: false })}
            />

            <div className="bg-background p-6 rounded-lg
            shadow-lg z-10 max-w-sm w-full">
                <div className="flex justify-between items-center">
                    <h3 className="text-foreground text-xl font-bold mb-2">
                        Invite Team
                    </h3>
                    <button onClick={() => close({ isError: false })}>
                        <X className="w-6 h-6 drop-shadow text-foreground cursor-pointer"></X>
                    </button>
                </div>

                {
                    error && <p className='text-red-600 '>{error}</p>
                }

                <form className="space-y-4 py-2 text-foreground" onSubmit={submitMember} >
                    <div className="space-y-1.5">
                        <Label>Full Name <span className="text-destructive">*</span></Label>
                        <Input placeholder="Jane Smith" value={inviteForm.name}
                            onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Email <span className="text-destructive">*</span></Label>
                        <Input type="email" placeholder="jane@company.com" value={inviteForm.email}
                            onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Phone <span className="text-destructive">*</span></Label>
                        <Input placeholder="Enter Phone" value={inviteForm.phone}
                            onChange={e => setInviteForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Role</Label>
                            <Select value={inviteForm.role} onValueChange={v => setInviteForm(f => ({ ...f, role: v }))}>
                                <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="owner">Owner</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Status</Label>
                            <Select value={inviteForm.status} onValueChange={v => setInviteForm(f => ({ ...f, status: v }))}>
                                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="away">Away</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                    //  onClick={handleInvite}
                    // disabled={loading || error.trim() === ""}
                    >
                        {loading ? "Inviting....." : "Invite Member"}
                        {/* Invite Member */}
                    </Button>
                </form>
            </div>
        </div>

    )
}

export default AddMemberForm