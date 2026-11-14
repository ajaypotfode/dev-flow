import { CircleAlert, CircleCheck, Clock3, ListTodo, LucideIcon, LucideProps, TrendingUp } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

interface StatsCardProps {
    title: string,
    value: number
    // loading: boolean
    icon: "total" | "completed" | "pending" | "overdue";
    trend: string;
    className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, className }) => {

    const ICONCONFIG = {
        total: ListTodo,
        completed: CircleCheck,
        pending: Clock3,
        overdue: CircleAlert,
    }

    const Icon = ICONCONFIG[icon];

    return (
        <Card className={`shadow-sm border-muted/50 ${className}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className="p-2 bg-background rounded-md shadow-sm border border-muted/50">
                        <Icon className={`h-5 w-5 text-purple-500`} />
                    </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                    {/* {loading ? (
                        <Skeleton className="h-8 w-16" />
                    ) : ( */}
                    <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
                    {/* )} */}
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    {trend && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                    {trend}
                </p>
            </CardContent>
        </Card>
    )
}

export default StatsCard