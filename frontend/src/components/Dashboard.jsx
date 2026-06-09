import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LabelList
} from 'recharts';
import { ArrowLeft, Users, TrendingUp, Trophy, Target, GraduationCap } from 'lucide-react';

const COLORS = ['#10B981', '#EF4444']; // Green for Passed, Red for Failed

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-lg">
        <p className="text-slate-800 font-bold text-sm mb-1.5">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs flex items-center space-x-2 font-medium" style={{ color: entry.color || entry.payload.fill }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color || entry.payload.fill || '#3b82f6' }}></span>
            <span>{entry.name}: {entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SectionHeader = ({ badgeNumber, title, subtitle }) => (
  <div className="flex items-start space-x-3 mb-6">
    <div className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-blue-500/20">
      {badgeNumber}
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-none">{title}</h3>
      {subtitle && <p className="text-xs font-semibold text-slate-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default function Dashboard({ data, onBack }) {
  if (!data) return null;

  const { kpis, clustered_column, histogram, stacked_column, horizontal_bar, radar, donut, smooth_line } = data;

  const kpiCards = [
    { title: 'Total Students', value: kpis.total_students, trend: kpis.total_students_trend, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100/50' },
    { title: 'Average Score', value: kpis.average_score, trend: kpis.average_score_trend, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100/50' },
    { title: 'Top Score', value: kpis.top_score, trend: kpis.top_score_trend, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100/50' },
    { title: 'Pass Rate', value: kpis.pass_rate, trend: kpis.pass_rate_trend, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100/50' },
    { title: 'Active Students', value: kpis.active_students, trend: kpis.active_students_trend, icon: GraduationCap, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100/50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Top Header Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Performance Dashboard</h1>
          <p className="text-slate-500 mt-1">Visualize and monitor academic metrics and test results.</p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl shadow-xs transition-all duration-200 shrink-0 self-start sm:self-center cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Upload
        </button>
      </div>

      {/* 1. Top KPI Summary Cards */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <SectionHeader badgeNumber="1" title="KPI Cards" subtitle="Core Student Performance Metrics" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {kpiCards.map((kpi, idx) => (
            <div key={idx} className={`border rounded-2xl p-5 shadow-xs transition-all duration-200 ${kpi.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">{kpi.title}</p>
                <div className={`p-2 rounded-xl bg-white shadow-2xs`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800">{kpi.value}</h3>
              <p className="text-xs font-bold text-emerald-600 mt-1.5 flex items-center">
                {kpi.trend}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Clustered Column Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <SectionHeader badgeNumber="2" title="Clustered Column Chart" subtitle="Average Score by Subject" />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clustered_column} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} domain={[0, 100]} className="text-xs font-semibold" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Average Score" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {clustered_column.map((entry, index) => {
                    const colors = ['#3B82F6', '#10B981', '#8B5CF6']; // blue, green, purple
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                  <LabelList dataKey="Average Score" position="top" fill="#475569" fontSize={11} fontWeight="700" offset={8} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Histogram */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <SectionHeader badgeNumber="3" title="Histogram" subtitle="Score Distribution" />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogram} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="range" stroke="#64748b" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Students" fill="#60A5FA" radius={[6, 6, 0, 0]} maxBarSize={55}>
                  <LabelList dataKey="Students" position="top" fill="#475569" fontSize={11} fontWeight="700" offset={8} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Stacked Column Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <SectionHeader badgeNumber="4" title="Stacked Column Chart" subtitle="Concept Mastery (Overall Average)" />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stacked_column} margin={{ top: 20, right: 100, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: '20px', fontSize: '12px', fontWeight: '600' }} />
                <Bar dataKey="Coding" stackId="a" fill="#3B82F6"><LabelList position="center" fill="#ffffff" fontSize={10} fontWeight="700" /></Bar>
                <Bar dataKey="Quiz" stackId="a" fill="#10B981"><LabelList position="center" fill="#ffffff" fontSize={10} fontWeight="700" /></Bar>
                <Bar dataKey="Assignment" stackId="a" fill="#F59E0B"><LabelList position="center" fill="#ffffff" fontSize={10} fontWeight="700" /></Bar>
                <Bar dataKey="Frameworks" stackId="a" fill="#F97316"><LabelList position="center" fill="#ffffff" fontSize={10} fontWeight="700" /></Bar>
                <Bar dataKey="Practice" stackId="a" fill="#8B5CF6"><LabelList position="center" fill="#ffffff" fontSize={10} fontWeight="700" /></Bar>
                <Bar dataKey="Theory" stackId="a" fill="#06B6D4" radius={[4, 4, 0, 0]}><LabelList position="center" fill="#ffffff" fontSize={10} fontWeight="700" /></Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Horizontal Bar Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <SectionHeader badgeNumber="5" title="Horizontal Bar Chart" subtitle="Top 10 Students" />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horizontal_bar} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                <YAxis dataKey="name" type="category" stroke="#64748b" tickLine={false} axisLine={false} className="text-xs font-semibold" width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Score" fill="#3B82F6" radius={[0, 6, 6, 0]} maxBarSize={18}>
                  <LabelList dataKey="Score" position="right" fill="#475569" fontSize={11} fontWeight="700" offset={8} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Radar Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col">
          <SectionHeader badgeNumber="6" title="Radar Chart" subtitle="Student Performance Profile" />
          <div className="flex-1 h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                <Radar name="Performance" dataKey="Score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Donut Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col relative">
          <SectionHeader badgeNumber="7" title="Donut Chart" subtitle="Pass vs Fail" />
          <div className="flex-1 h-[320px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donut}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {donut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: '600' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Donut Inside Stats Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-18px' }}>
              <span className="text-3xl font-extrabold text-slate-800">86%</span>
              <span className="text-xs font-semibold text-slate-500 mt-0.5">Pass Rate</span>
            </div>
          </div>
        </div>

        {/* 8. Line Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <SectionHeader badgeNumber="8" title="Line Chart" subtitle="Performance Trend (Average Score)" />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={smooth_line} margin={{ top: 25, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} domain={[50, 100]} className="text-xs font-semibold" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Score" stroke="#3B82F6" strokeWidth={3.5} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6 }}>
                  <LabelList dataKey="Score" position="top" fill="#475569" fontSize={11} fontWeight="700" offset={10} />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
