import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { getSkillsStats, getCandidates } from '@/lib/api';
import { Candidate } from '@/data/mockData';

export default function Analytics() {
  const [skillGapData, setSkillGapData] = useState<any[]>([]);
  const [matchDistributionData, setMatchDistributionData] = useState<any[]>([]);
  const [topMatchedSkillsData, setTopMatchedSkillsData] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsStats, candidatesData] = await Promise.all([
          getSkillsStats(),
          getCandidates()
        ]);
        setSkillGapData(skillsStats.skillGapData);
        setMatchDistributionData(skillsStats.matchDistributionData);
        setTopMatchedSkillsData(skillsStats.topMatchedSkillsData);
        setCandidates(candidatesData);
      } catch (error) {
        console.error("Failed to load analytics data", error);
      }
    };
    fetchData();
  }, []);

  // Calculate skill gap percentages
  const skillGapPercentages = skillGapData.map((item) => ({
    ...item,
    matchRate: Math.round((item.matched / item.candidates) * 100),
    gapRate: Math.round(((item.candidates - item.matched) / item.candidates) * 100),
  }));

  const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#dc2626', '#991b1b'];

  if (candidates.length === 0) return <div className="p-6">Loading analytics...</div>;

  return (
    <div className="min-h-screen">
      <Header
        title="Skill Analytics"
        subtitle="Analyze skill matching and candidate distribution"
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-5">
            <p className="text-sm font-medium text-muted-foreground">Average Skill Match</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {Math.round(candidates.reduce((acc, c) => acc + c.skillMatch, 0) / candidates.length)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Across all candidates</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-5">
            <p className="text-sm font-medium text-muted-foreground">Excellent Matches (90%+)</p>
            <p className="text-3xl font-bold text-success mt-1">
              {candidates.filter((c) => c.overallScore >= 90).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Out of {candidates.length} candidates</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-5">
            <p className="text-sm font-medium text-muted-foreground">Most Common Gap</p>
            <p className="text-3xl font-bold text-foreground mt-1">GraphQL</p>
            <p className="text-xs text-muted-foreground mt-1">60% of candidates missing</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Gap Analysis */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Skill Gap Analysis
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Percentage of candidates matching each required skill
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillGapPercentages}
                  layout="vertical"
                  margin={{ left: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    type="category"
                    dataKey="skill"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Match Rate']}
                  />
                  <Bar
                    dataKey="matchRate"
                    fill="hsl(217, 91%, 60%)"
                    radius={[0, 4, 4, 0]}
                    name="Match Rate"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Match Distribution Pie Chart */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Candidate Distribution by Match Score
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              How candidates are distributed across score ranges
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={matchDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="range"
                    label={({ range, count }) => `${range}: ${count}`}
                    labelLine={false}
                  >
                    {matchDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Matched Skills */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Top Matched Skills
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Skills with highest match rates among candidates
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMatchedSkillsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="skill"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Match Rate']}
                />
                <Bar
                  dataKey="matchRate"
                  fill="hsl(142, 76%, 36%)"
                  radius={[4, 4, 0, 0]}
                  name="Match Rate"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
