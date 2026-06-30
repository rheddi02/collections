"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { keepPreviousData } from "@tanstack/react-query";
import { BarChart2Icon, CheckCircleIcon, TrendingUpIcon, UsersIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import StatCard from "../_components/stat-card";
import ActivityFeed from "../_components/activity-feed";

const ROLE_COLORS: Record<string, string> = {
  USER: "hsl(var(--chart-1))",
  ADMIN: "hsl(var(--chart-2))",
  COLLABORATOR: "hsl(var(--chart-3))",
  GUEST: "hsl(var(--chart-4))",
};

const DAYS_OPTIONS = [7, 30, 90] as const;
type Days = (typeof DAYS_OPTIONS)[number];

export default function AdminDashboardPage() {
  const [days, setDays] = useState<Days>(30);

  const { data: overview } = api.admin.stats.overview.useQuery(undefined, {
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: growth } = api.admin.stats.userGrowth.useQuery(
    { days },
    { staleTime: 2 * 60 * 1000, refetchOnWindowFocus: false, placeholderData: keepPreviousData },
  );

  const { data: roleDistribution } = api.admin.stats.roleDistribution.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: activity } = api.admin.stats.recentActivity.useQuery(undefined, {
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const chartConfig = {
    count: { label: "New users", color: "hsl(var(--chart-1))" },
  };

  return (
    <div className="custom-scrollbar h-full overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-semibold">System Dashboard</h1>
          <p className="text-sm text-muted-foreground">Platform overview and analytics</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={overview?.totalUsers ?? 0}
            icon={<UsersIcon className="h-4 w-4" />}
          />
          <StatCard
            label="Verified Users"
            value={overview?.verifiedUsers ?? 0}
            icon={<CheckCircleIcon className="h-4 w-4" />}
          />
          <StatCard
            label="New This Week"
            value={overview?.newThisWeek ?? 0}
            icon={<TrendingUpIcon className="h-4 w-4" />}
            delta={{ value: overview?.newThisWeek ?? 0, label: "this week" }}
          />
          <StatCard
            label="Total Content"
            value={(overview?.totalLinks ?? 0) + (overview?.totalCategories ?? 0)}
            icon={<BarChart2Icon className="h-4 w-4" />}
            delta={{
              value: overview?.totalLinks ?? 0,
              label: `links · ${overview?.totalCategories ?? 0} categories`,
            }}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          {/* Area chart — spans 3 cols */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">User Growth</CardTitle>
              <div className="flex gap-1">
                {DAYS_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`rounded px-2 py-0.5 text-xs transition-colors ${
                      days === d
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-48 w-full">
                <AreaChart data={growth ?? []}>
                  <defs>
                    <linearGradient id="gradCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v: string) => v.slice(5)}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#gradCount)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Role distribution donut */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Roles</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer config={{}} className="h-48 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="role" />} />
                  <Pie
                    data={roleDistribution ?? []}
                    dataKey="count"
                    nameKey="role"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {(roleDistribution ?? []).map((entry) => (
                      <Cell key={entry.role} fill={ROLE_COLORS[entry.role] ?? "hsl(var(--chart-5))"} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="role" />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity feed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed events={activity ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
