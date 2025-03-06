"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/component/ui/Card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/app/component/ui/Chart";

import React, { useEffect, useState } from "react";

const matches_full =
    "https://api.opendota.com/api/players/152850421/matches?significant=0&project=duration&project=game_mode&project=lobby_type&project=start_time&project=average_rank&project=hero_variant";

export async function fetchMatches() {
    try {
        const response = await fetch(matches_full);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch matches:", error);
        throw error;
    }
}

const Dranks: React.FC = () => {
    interface Match {
        match_id: number;
        duration: number;
        start_time: number;
    }

    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [monthlyCounts, setMonthlyCounts] = useState<{ [key: string]: number }>(
        {}
    );

    useEffect(() => {
        const getMatches = async () => {
            try {
                const data = await fetchMatches();
                setMatches(data);

                const counts: { [key: string]: number } = {};
                data.forEach((match: Match) => {
                    const date = new Date(match.start_time * 1000);
                    if (date.getFullYear() === 2025) {
                        const month = date.toLocaleString("en-US", { month: "long" });
                        counts[month] = (counts[month] || 0) + 1;
                    }
                });
                setMonthlyCounts(counts);
            } catch {
                setError("Failed to fetch matches");
            } finally {
                setLoading(false);
            }
        };

        getMatches();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    const chartData = Object.keys(monthlyCounts).map((month) => ({
        month,
        desktop: monthlyCounts[month],
    }));

    const chartConfig = {
        desktop: {
            label: "match",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
            <Card>
                <CardHeader>
                    <CardTitle>Bar Chart</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
    );
};

export default Dranks;
