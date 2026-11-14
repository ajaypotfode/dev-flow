import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Member } from '@/src/type/analytics'

interface TeamProgressChartProps {
    members: Member[]
}

const TeamProgressChart = ({ members }: TeamProgressChartProps) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Individual Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                {/* {isLoading ? (
                    <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
                ) : ( */}
                <div className="space-y-3">
                    {(members ?? []).map(member => (
                        <div key={member.memberId} className="flex items-center gap-4">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={member?.image ?? undefined} />
                                <AvatarFallback className="text-xs">{member.memberName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium truncate">{member.memberName}</span>
                                    <span className="text-xs text-muted-foreground ml-3 flex-shrink-0">{member.completed}/{member.total} tasks</span>
                                </div>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${member.completionRate}%` }} />
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-muted-foreground w-10 text-right flex-shrink-0">
                                {member.completionRate}%
                            </span>
                        </div>
                    ))}
                </div>
                {/* )} */}
            </CardContent>
        </Card>
    )
}

export default TeamProgressChart