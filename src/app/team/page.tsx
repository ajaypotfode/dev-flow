// import apiClient from '@/src/axios/axios';
import MemberCard from '@/src/components/team/memberCard';
import { InviteMemberButton } from '@/src/components/team/actionButton';
import { requireSession } from '@/src/lib/require_session';
import { getTeamListService } from '@/src/services/team';
// import AddMemberForm from './AddTeam';
// import UpdateMemberForm from './UpdateTeam';

const Teams = async () => {
    const session = await requireSession();
    const users = await getTeamListService();
  
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team</h1>
                    <p className="text-muted-foreground mt-1">{(users ?? []).length} members in your workspace</p>
                </div>
                <div className="flex items-center gap-2">
                    {(session.role === 'admin') && <InviteMemberButton />}
                </div>
                {/* <Dialog>
                    <DialogTrigger asChild>
                        <Button >
                            <UserPlus className="h-4 w-4 mr-2" />Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>Invite Member</DialogTitle></DialogHeader>
                        <AddMemberForm
                            submit={submitMember}
                        />
                    </DialogContent>
                </Dialog> */}
                {/* <Button onClick={() => setInviteOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />Invite Member
                </Button> */}
            </div>

            {/* {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
                </div>
            ) : ( */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            // initial="hidden" animate="visible"
            // variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
                {(users ?? []).map((member, i) => (
                    <MemberCard
                        key={i}
                        member={member}
                    />
                ))}
            </div>
            {/* )} */}
        </div>

    )
}

export default Teams