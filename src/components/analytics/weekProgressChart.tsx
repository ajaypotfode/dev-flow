"use client";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
// import { AreaChart } from 'lucide-react'
import { SprintData } from '@/src/type/analytics'

interface WeekProgressChartProps {
    sprintData: SprintData[]
}


const WeekProgressChart = ({ sprintData }: WeekProgressChartProps) => {
    return (
        <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Sprint Progress — Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    {/* {isLoading? <Skeleton className="w-full h-full rounded-lg" /> : ( */}
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sprintData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="aCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="aCreated" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} itemStyle={{ color: "hsl(var(--foreground))" }} />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                            <Area type="monotone" dataKey="completed" name="Completed" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#aCompleted)" />
                            <Area type="monotone" dataKey="created" name="Created" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#aCreated)" />
                        </AreaChart>
                    </ResponsiveContainer>
                    {/* )} */}
                </div>
            </CardContent>
        </Card>
    )
}

export default WeekProgressChart