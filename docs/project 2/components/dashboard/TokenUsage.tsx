'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { TokenCounter } from '@/components/TokenCounter';

// Sample data
const tokenData = [
  { name: 'Monday', tokens: 1230 },
  { name: 'Tuesday', tokens: 890 },
  { name: 'Wednesday', tokens: 1550 },
  { name: 'Thursday', tokens: 1320 },
  { name: 'Friday', tokens: 1450 },
  { name: 'Saturday', tokens: 760 },
  { name: 'Sunday', tokens: 640 },
];

interface TokenUsageProps {
  className?: string;
  totalTokens?: number;
  usedTokens?: number;
}

export function TokenUsage({ className, totalTokens = 5000, usedTokens = 2800 }: TokenUsageProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const barColors = {
    light: [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ],
    dark: [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ],
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="text-sm font-medium">{payload[0].payload.name}</p>
          <p className="text-sm">
            <span className="font-medium">{payload[0].value}</span> tokens
          </p>
        </div>
      );
    }
    return null;
  };
  
  if (!mounted) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[200px] animate-pulse bg-muted rounded-md" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <TokenCounter used={usedTokens} total={totalTokens} size="lg" />
          <div className="flex-1 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="tokens" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {tokenData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={barColors[theme === 'dark' ? 'dark' : 'light'][index % 5]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}