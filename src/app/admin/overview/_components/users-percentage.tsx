'use client'
import React, { useMemo } from 'react'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Label } from 'recharts';
import { useNumberOfRoles } from '@/features/auth/api/use-all-user-count';
import {
    Card,
    CardContent,
  
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
export default  function UsersPercentage() {
    const users = useNumberOfRoles()

    const totalUsers = useMemo(() => {
        return users.data?.reduce((acc, curr) => acc + curr.value, 0) || 0
    }, [users.data])
 
    const chartConfig = {
        Admin: {
          
        },
        Parent: {
          label: "Parent",
          color: "#4B0082",
        },
        Teacher: {
            label: "Teacher",
            color: "#0B3D0B",
        },
      } satisfies ChartConfig

  return (
    <Card>
        <CardHeader>
            <CardTitle>User Distribution by Role</CardTitle>
        </CardHeader>
        <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto my-auto aspect-square max-h-[250px]">
            <PieChart >
                <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent hideLabel />}
                    />
                <Pie
                    data={users.data}
                    innerRadius={60}
            
                    dataKey="value"
            
                    nameKey="userRole"
                    strokeWidth={10}
                >
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {totalUsers.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Users
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
            </PieChart>
            </ChartContainer>
        </CardContent>
      
    </Card>
    
  )
}