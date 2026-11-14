"use client"
import { MoreHorizontal } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"

import { Button } from "../ui/button"
// import { Skeleton } from "../ui/skeleton"
import { TeamDataType } from "@/src/type/dashboard"

interface ProductivityChartProps {
    // chartData: SprintDataType[];
    teamData: TeamDataType[]
}

const ProductivityChart = ({ teamData }: ProductivityChartProps) => {
    return (
        <Card className="shadow-sm border-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Team Productivity</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] mt-4">
                    {
                        teamData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={teamData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <YAxis dataKey="memberName" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} width={80} />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No data available</div>
                        )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductivityChart