import { LucideIcon } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from '../ui/card'

interface AnalyticscardProps {
    label: string,
    value: string,
    Icon: LucideIcon,
    sub: string,
    color: string,
    highlight?: boolean
}

const AnalyticsCard = ({ label, value, Icon, sub, color, highlight }: AnalyticscardProps) => {
    return (
        <div
        //  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
        >
            <Card className={highlight ? "border-red-500/20 bg-red-500/5" : ""}>
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <div className="p-1.5 rounded-md bg-muted">
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                    </div>
                    {/* {statsLoading ? <Skeleton className="h-8 w-20" /> : ( */}
                    <p className="text-3xl font-bold">{value}</p>
                    {/* )} */}
                    <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default AnalyticsCard