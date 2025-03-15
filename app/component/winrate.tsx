"use client"
import { useEffect, useState } from 'react';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
    CardFooter,
} from "../component/ui/Card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../component/ui/Chart"
import { getWinrate } from '../data/game/winrate';

  type Stats = {
    win: number;
    lose: number;
  };

  export default function WinRate() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getWinrate();
                const stats = await data;
                setStats(stats);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);
      const totalMatches = stats ? stats.win + stats.lose : 0;
      const percentage = stats ? ((stats.win / totalMatches) * 100).toPrecision(3) : '0.00';

      const chartData = [{ total: totalMatches,
        win: stats?.win || 0,
        lose: stats?.lose || 0,
        }]
      const chartConfig = {
        win: {
          label: "win",
          color: "hsl(142.1 76.2% 36.3%)",
        },
        lose: {
          label: "lose",
          color: "hsl(0 73.7% 41.8%)",
        },
      } satisfies ChartConfig

      return (
   <div>
     <Card className="flex flex-col">
      <CardHeader className="text-left pb-0">
        <CardTitle>Winrate</CardTitle>
        <CardDescription>Total all game you play</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalMatches.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Matches
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="win"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-win)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="lose"
              fill="var(--color-lose)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="items-center gap-2 font-medium leading-none">
            You have been playing <span className='text-amber-400'>{totalMatches}</span> matches with a winrate of <span className='text-amber-400'>{percentage}%</span>
        </div>
      </CardFooter>
    </Card>
   </div>
      );
    }
