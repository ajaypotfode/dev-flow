export const calculateTrend = (
    current: number,
    previous: number
) => {
    if (previous === 0) return "+100%";

    const trend = Math.round(
        ((current - previous) / previous) * 100
    );

    return `${trend > 0 ? "+" : ""}${trend}%`;
};
