import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CheckCircle2, Clock, Mail } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Team } from '@/src/type/user'
import MemberMenu from './memberMenu'
import StatusBadge from './StatusBadge'

interface MemberCardProps {
    member: Team;
    // updateMember: (id: string) => void
    // deleteMember: (id: string) => void
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {

    const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
        active: { label: "Active", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-emerald-500" },
        away: { label: "Away", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", dot: "bg-yellow-500" },
        offline: { label: "Offline", color: "bg-muted text-muted-foreground border-muted", dot: "bg-muted-foreground/40" },
    };

    const ROLE_COLOR: Record<string, string> = {
        leader: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        admin: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        member: "bg-secondary text-secondary-foreground",
        viewer: "bg-muted text-muted-foreground",
    };

    const statusCfg = STATUS_CONFIG[member.status ?? "offline"] ?? STATUS_CONFIG.offline;
    return (
        <Card className="hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
            <CardContent className="p-5 space-y-4 relative">
                <div className='absolute -top-1 right-0'>
                    <MemberMenu member={member} />
                </div>
                <div className="flex items-start gap-4">
                    <StatusBadge
                        name={member.name}
                        image={member.image ?? ""}
                        userId={member.id}
                    />
                    {/* <div className="relative flex-shrink-0">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={member.image ?? undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {member.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${statusCfg.dot}`} />
                    </div> */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{member.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                            <Mail className="h-3 w-3 flex-shrink-0" />{member.email}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <Badge variant="outline" className={`text-[10px] ${ROLE_COLOR[member.role] ?? ROLE_COLOR.member}`}>
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </Badge>
                            {/* <Badge variant="outline" className={`text-[10px] ${statusCfg.color}`}>
                                {statusCfg.label}
                            </Badge> */}
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                            <p className="text-base font-bold">{member.progress.completedTasks ?? 0}</p>
                            <p className="text-[10px] text-muted-foreground">Completed</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                            <Clock className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                            <p className="text-base font-bold">{member.progress.activeTasks}</p>
                            <p className="text-[10px] text-muted-foreground">In Progress</p>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">Completion rate</span>
                            <span className="font-semibold">{member.progress.completionRate}%</span>
                        </div>
                        <Progress value={member.progress.completionRate} className="h-1.5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MemberCard