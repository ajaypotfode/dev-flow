
"use client";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {PieChart ,Cell, Legend, Pie, ResponsiveContainer, Tooltip } from 'recharts'
// import { PieChart } from 'lucide-react'
import { PieData } from '@/src/type/analytics'

interface TaskDistributionChartProps {
    pieData: PieData[]
}

const TaskDistributionChart = ({ pieData }: TaskDistributionChartProps) => {
    const PIE_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Task Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    {/* {isLoading? <Skeleton className="w-full h-full rounded-full" /> : ( */}
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={95}
                                paddingAngle={3} dataKey="value">
                                {pieData.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* )} */}
                </div>
            </CardContent>
        </Card>
    )
}

export default TaskDistributionChart