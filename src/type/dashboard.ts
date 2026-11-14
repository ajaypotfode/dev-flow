export interface StatsDataType {
    title: string;
    value: number;
    icon: "total" | "completed" | "pending" | "overdue";
    trend: string;
};

export interface SprintDataType {
    day: string;
    completed: number;
}


export interface TeamDataType {
    memberName: string,
    completed: number
}