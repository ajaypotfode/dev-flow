"use client";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TeamData } from '@/src/type/analytics'

interface TeamProductivityChartProps {
    teamData: TeamData[]
}

const TeamProductivityChart = ({teamData}:TeamProductivityChartProps) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Team Productivity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[240px]">
                    {/* {isLoading ? <Skeleton className="w-full h-full rounded-lg" /> : ( */}
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={teamData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="memberName" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} itemStyle={{ color: "hsl(var(--foreground))" }} />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                            <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="inProgress" name="In Progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    {/* )} */}
                </div>
            </CardContent>
        </Card>

    )
}

export default TeamProductivityChart