"use client"
import React, { useEffect, useState } from 'react'
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import { X } from 'lucide-react';
import {  User } from '@/src/type/user';
import { ModalComponentType } from '@/src/context/dynamicModal';
import { updateTeamMemberAction } from '@/src/features/team/action';
import { useRouter } from 'next/navigation';


interface Result {
    isError: boolean;
    message?: string;
}
interface UpdateFormProps {
    member: User & { id: string };
}
const UpdateMemberForm: React.FC<ModalComponentType<Result, UpdateFormProps>> = ({ close, props }) => {
    const { member } = props;

    const [inviteForm, setInviteForm] = useState({
        name: member.name,
        email: member.email,
        role: member.role,
        status: member.status,
        phone: String(member.phone)
        // image:""
    });
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const updateMember = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const isValid =
            inviteForm.name.trim() !== "" &&
            inviteForm.email.trim() !== "" &&
            inviteForm.role !== "" &&
            inviteForm.status !== "" &&
            inviteForm.phone !== ""

        if (!isValid) {
            // show error
            setError("Please fill in all required fields.");
            return;
        }

        const payload = {
            id: member.id,
            name: inviteForm.name,
            email: inviteForm.email,
            role: inviteForm.role,
            image: '',
            status: inviteForm.status,
            phone: inviteForm.phone
        }
        // console.log("project color  :", payload);
        setLoading(true);
        const response = await updateTeamMemberAction(payload);
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
                        Update Member
                    </h3>
                    <button onClick={() => close({ isError: false })}>
                        <X className="w-6 h-6 drop-shadow text-foreground cursor-pointer"></X>
                    </button>
                </div>

                <form className="space-y-4 py-2 text-foreground " onSubmit={updateMember} >
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
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="leader">Leader</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Status</Label>
                            <Select value={inviteForm.status} onValueChange={v => setInviteForm(f => ({ ...f, status: v }))}>
                                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="blocked">Blocked</SelectItem>
                                    {/* <SelectItem value="offline">Offline</SelectItem> */}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        disabled={loading || error.trim() === ""}
                    >
                        {loading ? "Updating Member…" : "Update Member"}
                    </Button>
                </form>
            </div>
        </div>

    )
}

export default UpdateMemberForm