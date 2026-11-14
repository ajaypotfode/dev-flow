import StatsCard from '@/src/components/dashboard/statsCard'
import ProgressChart from '@/src/components/dashboard/progressChart';
import ProductivityChart from '@/src/components/dashboard/productivityChart';
import { dashboardDataService } from '@/src/services/dashboard';
import { requireSession } from '@/src/lib/require_session';

const Dashboard = async () => {

    await requireSession();

    const { statsData, teamData, sprintData } = await dashboardDataService();

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Overview of your workspace activity and progress.</p>
                </div>
                {/* <div className="flex items-center gap-2">
                    <Button variant="outline">Customize</Button>
                    <Button>New Task</Button>
                </div> */}
            </div>

            {/* Top Stats Cards */}
            {statsData && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {
                    statsData.map((stats, index) => (
                        <StatsCard
                            key={index}
                            title={stats.title}
                            value={stats?.value || 0}
                            // loading={stats.loading}
                            icon={stats.icon}
                            trend={stats.trend}
                        />
                    ))
                }
            </div>}

            {/* Chart */}
            <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ProgressChart chartData={sprintData} />
                    <ProductivityChart teamData={teamData} />
                </div>
                {/* <Suspense fallback={<p>Loading.....</p>}>
                    <AreaChartCard
                        teamData={teamsData}
                        chartData={sprintData}
                    />
                </Suspense> */}
            </div>
        </div>
    )
}

export default Dashboard