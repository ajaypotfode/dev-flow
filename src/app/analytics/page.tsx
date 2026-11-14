import AnalyticsCard from "@/src/components/analytics/analyticsCard";
import TaskDistributionChart from "@/src/components/analytics/taskDistributionChart";
import TeamProductivityChart from "@/src/components/analytics/teamProductivityChart";
import TeamProgressChart from "@/src/components/analytics/teamProgressChart";
import WeekProgressChart from "@/src/components/analytics/weekProgressChart";
import { requireSession } from "@/src/lib/require_session";
import { analyticsDataService } from "@/src/services/analytics";
import { AlertCircle, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { forbidden, redirect } from "next/navigation";

const Analytics = async () => {
    const session = await requireSession();

    const hasAccess =
        session.role === "admin" ||
        session.role === "leader";

        console.log("role :",session.role);
        

    if (!hasAccess) {
        forbidden();
    }


    const { sprintData, statsData, teamData, pieData, members } = await analyticsDataService()



    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">Insights into your teams productivity and progress</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {[
                    { label: "Completion Rate", value: `${statsData.completionRate ?? 0}%`, color: "text-emerald-500", icon: TrendingUp, sub: `${statsData.completedTasks ?? 0} of ${statsData.totalTasks ?? 0} tasks` },
                    { label: "Weekly Completed", value: `${statsData.completedTasks ?? 0}`, color: "text-blue-500", icon: CheckCircle2, sub: "tasks this week" },
                    { label: "Active Projects", value: `${statsData?.activeProjects ?? 0}`, color: "text-purple-500", icon: Zap, sub: `of ${statsData.totalProjects ?? 0} total` },
                    { label: "Overdue Tasks", value: `${statsData?.overdueTasksCount ?? 0}`, color: "text-red-500", icon: AlertCircle, sub: "need attention", highlight: (statsData.overdueTasksCount ?? 0) > 0 },
                ].map((card, i) => (
                    <AnalyticsCard
                        key={i}
                        label={card.label}
                        value={card.value}
                        Icon={card.icon}
                        sub={card.sub}
                        highlight={card.highlight}
                        color={card.color}
                    />

                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sprint Progress Area Chart */}
                <WeekProgressChart sprintData={sprintData} />
                {/* Task Distribution Pie */}
                <TaskDistributionChart pieData={pieData} />
            </div>
            {/* Team Productivity */}
            <TeamProductivityChart teamData={teamData} />

            {/* Team breakdown table (Team Progress) */}
            <TeamProgressChart members={members} />
        </div>
    )
}

export default Analytics