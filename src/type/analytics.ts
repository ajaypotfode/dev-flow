
export interface Stat {
    totalTasks: number;
    completedTasks: number;
    overdueTasksCount: number;
    activeProjects: number;
    totalProjects: number;
    completionRate: number;
}

export interface SprintData {
    day: string;
    completed: number;
    created: number;
}

export interface PieData {
    name: string;
    value: number;
}

export interface TeamData {
    memberName: string;
    completed: number;
    inProgress: number;
}

export interface Member {
    memberId: string;
    memberName: string;
    completed: number;
    total: number;
    image?:string;
    completionRate: number;

}


export interface AnalyticsData {
    stats: Stat,
    sprintData: SprintData[],
    pieData: PieData[],
    teamData: TeamData[],
    members: Member[]
}