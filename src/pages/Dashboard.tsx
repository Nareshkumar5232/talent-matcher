import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MatchScoreBadge } from '@/components/common/MatchScore';
import { Users, FileText, UserCheck, Target, Clock, Upload, CheckCircle, XCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { getDashboardStats, getActivityStats, getCandidates } from '@/lib/api';
import { Candidate, DashboardStats, ActivityItem } from '@/data/mockData';

const activityIcons = {
  upload: Upload,
  shortlist: CheckCircle,
  reject: XCircle,
  review: Eye,
};

const activityColors = {
  upload: 'text-accent',
  shortlist: 'text-success',
  reject: 'text-destructive',
  review: 'text-warning',
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [processingActivity, setProcessingActivity] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [topCandidates, setTopCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activityData, candidatesData] = await Promise.all([
          getDashboardStats(),
          getActivityStats(),
          getCandidates()
        ]);

        setStats(statsData);
        setProcessingActivity(activityData.processingActivityData);
        setRecentActivity(activityData.recentActivity);

        const sorted = candidatesData
          .filter((c: Candidate) => c.status !== 'rejected')
          .sort((a: Candidate, b: Candidate) => b.overallScore - a.overallScore)
          .slice(0, 5);
        setTopCandidates(sorted);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };
    fetchData();
  }, []);

  if (!stats) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Overview of your recruitment pipeline"
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Candidates"
            value={stats.totalCandidates.toLocaleString()}
            change={stats.weeklyChange.candidates}
            icon={Users}
            variant="blue"
          />
          <KPICard
            title="Resumes Processed"
            value={stats.resumesProcessed.toLocaleString()}
            change={stats.weeklyChange.processed}
            icon={FileText}
            variant="green"
          />
          <KPICard
            title="Shortlisted"
            value={stats.shortlistedCandidates}
            change={stats.weeklyChange.shortlisted}
            icon={UserCheck}
            variant="orange"
          />
          <KPICard
            title="Avg. Skill Match"
            value={`${stats.averageSkillMatch}%`}
            change={stats.weeklyChange.skillMatch}
            icon={Target}
            variant="purple"
          />
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Processing Activity Chart */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Resume Processing Activity
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processingActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="uploads"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    dot={false}
                    name="Uploads"
                  />
                  <Line
                    type="monotone"
                    dataKey="processed"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={2}
                    dot={false}
                    name="Processed"
                  />
                  <Line
                    type="monotone"
                    dataKey="shortlisted"
                    stroke="hsl(38, 92%, 50%)"
                    strokeWidth={2}
                    dot={false}
                    name="Shortlisted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activityIcons[activity.type as keyof typeof activityIcons];
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 ${activityColors[activity.type as keyof typeof activityColors]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.candidateName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.jobTitle}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Candidates Table */}
        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">
              Top Candidates
            </h2>
            <p className="text-sm text-muted-foreground">
              Highest matching candidates across all job positions
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>Experience</th>
                  <th>Skill Match</th>
                  <th>Overall Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topCandidates.map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-foreground">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.email}</p>
                      </div>
                    </td>
                    <td className="text-foreground">{candidate.experience} years</td>
                    <td>
                      <MatchScoreBadge score={candidate.skillMatch} />
                    </td>
                    <td>
                      <MatchScoreBadge score={candidate.overallScore} />
                    </td>
                    <td>
                      <StatusBadge status={candidate.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
