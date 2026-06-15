import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LabelList
} from 'recharts';
import { ArrowLeft, Users, TrendingUp, Trophy, Target, GraduationCap } from 'lucide-react';
import D3BarChart from './D3BarChart';
import D3DonutChart from './D3DonutChart';
import D3PieChart from './D3PieChart';

const COLORS = ['#667846', '#a56c43', '#819363', '#b88562', '#4f5e34', '#caa386'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-lg">
        <p className="text-coffee-900 font-bold text-sm mb-1.5">{label}</p>
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
    <div className="bg-olive-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-olive-500/20">
      {badgeNumber}
    </div>
    <div>
      <h3 className="text-lg font-bold text-coffee-900 tracking-tight leading-none">{title}</h3>
      {subtitle && <p className="text-xs font-semibold text-coffee-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default function Dashboard({ data, onBack }) {
  if (!data) return null;

  const { kpis = [], charts = [] } = data;

  const icons = [Users, TrendingUp, Trophy, Target, GraduationCap];
  const colorMap = {
    blue: { text: 'text-olive-600', bg: 'bg-olive-50 border-olive-100/50' },
    emerald: { text: 'text-coffee-600', bg: 'bg-coffee-50 border-coffee-100/50' },
    amber: { text: 'text-olive-700', bg: 'bg-olive-100 border-olive-200/50' },
    purple: { text: 'text-coffee-700', bg: 'bg-coffee-100 border-coffee-200/50' },
    cyan: { text: 'text-olive-800', bg: 'bg-olive-200 border-olive-300/50' },
    slate: { text: 'text-coffee-500', bg: 'bg-coffee-50 border-coffee-100/50' },
  };



  const dynamicKpiCards = kpis.slice(0, 5).map((kpi, idx) => {
    const Icon = icons[idx % icons.length];
    const colors = colorMap[kpi.color] || colorMap.slate;
    return {
      title: kpi.label || '-',
      value: kpi.value || '-',
      trend: kpi.trend || '',
      icon: Icon,
      color: colors.text,
      bg: colors.bg,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Top Header Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-coffee-200">
        <div>
          <h1 className="text-3xl font-extrabold text-coffee-950 tracking-tight">Student Performance Dashboard</h1>
          <p className="text-coffee-600 mt-1">Visualize and monitor academic metrics and test results.</p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-coffee-200 hover:bg-coffee-50 text-coffee-800 text-sm font-semibold rounded-xl shadow-xs transition-all duration-200 shrink-0 self-start sm:self-center cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Upload
        </button>
      </div>

      {/* 1. Top KPI Summary Cards */}
      <div className="bg-white border border-coffee-100 rounded-3xl p-6 shadow-sm">
        <SectionHeader badgeNumber="1" title="KPI Cards" subtitle="Key Performance Indicators" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {dynamicKpiCards.map((kpi, idx) => (
            <div key={idx} className={`border rounded-2xl p-5 shadow-xs transition-all duration-200 ${kpi.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-coffee-600 tracking-wide uppercase">{kpi.title}</p>
                <div className={`p-2 rounded-xl bg-white shadow-2xs`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-black text-coffee-900">{kpi.value}</h3>
              <p className="text-xs font-bold text-olive-600 mt-1.5 flex items-center">
                {kpi.trend}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {charts.map((chart, index) => {
          const badgeNumber = (index + 2).toString();
          return (
            <div key={chart.id || index} className={`bg-white border border-coffee-100 rounded-3xl p-6 shadow-sm flex flex-col ${chart.type === 'area' ? 'lg:col-span-2' : ''}`}>
              <SectionHeader badgeNumber={badgeNumber} title={chart.title || 'Chart'} subtitle={chart.subtitle || ''} />
              <div className="flex-1 h-[320px] flex items-center justify-center relative">
                {(() => {
                  const { type, data: chartData, xAxisKey, dataKeys } = chart;
                  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#F97316', '#8B5CF6', '#06B6D4'];

                  if (!chartData || chartData.length === 0) {
                    return <div className="text-coffee-500">No data available</div>;
                  }

                  switch (type) {
                    case 'bar':
                      return (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f6f0e3" vertical={false} />
                            <XAxis dataKey={xAxisKey} stroke="#a36d4a" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                            <YAxis stroke="#a36d4a" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {dataKeys && dataKeys.map((key, idx) => (
                              <Bar key={key} dataKey={key} fill={chartColors[idx % chartColors.length]} radius={[4, 4, 0, 0]} maxBarSize={55} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      );
                    case 'stacked_bar':
                      return (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 20, right: 100, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f6f0e3" vertical={false} />
                            <XAxis dataKey={xAxisKey} stroke="#a36d4a" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                            <YAxis stroke="#a36d4a" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: '20px', fontSize: '12px', fontWeight: '600' }} />
                            {dataKeys && dataKeys.map((key, idx) => {
                              const isLast = idx === dataKeys.length - 1;
                              return (
                                <Bar key={key} dataKey={key} stackId="a" fill={chartColors[idx % chartColors.length]} radius={isLast ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                              );
                            })}
                          </BarChart>
                        </ResponsiveContainer>
                      );
                    case 'horizontal_bar':
                      return (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f6f0e3" horizontal={false} />
                            <XAxis type="number" stroke="#a36d4a" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                            <YAxis dataKey={xAxisKey} type="category" stroke="#a36d4a" tickLine={false} axisLine={false} className="text-xs font-semibold" width={90} />
                            <Tooltip content={<CustomTooltip />} />
                            {dataKeys && dataKeys.map((key, idx) => (
                              <Bar key={key} dataKey={key} fill={chartColors[idx % chartColors.length]} radius={[0, 4, 4, 0]} maxBarSize={18} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      );
                    case 'area':
                    case 'line':
                      return (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 25, right: 20, left: -20, bottom: 0 }}>
                            <defs>
                              {dataKeys && dataKeys.map((key, idx) => (
                                <linearGradient key={`grad-${key}`} id={`colorGradient${idx}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={chartColors[idx % chartColors.length]} stopOpacity={0.15}/>
                                  <stop offset="95%" stopColor={chartColors[idx % chartColors.length]} stopOpacity={0}/>
                                </linearGradient>
                              ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f6f0e3" vertical={false} />
                            <XAxis dataKey={xAxisKey} stroke="#a36d4a" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                            <YAxis stroke="#a36d4a" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {dataKeys && dataKeys.map((key, idx) => (
                              <Area key={key} type="monotone" dataKey={key} stroke={chartColors[idx % chartColors.length]} strokeWidth={3.5} fillOpacity={1} fill={`url(#colorGradient${idx})`} activeDot={{ r: 6 }} />
                            ))}
                          </AreaChart>
                        </ResponsiveContainer>
                      );
                    case 'radar':
                      return (
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey={xAxisKey} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} tick={{ fill: '#94a3b8' }} />
                            <Tooltip content={<CustomTooltip />} />
                            {dataKeys && dataKeys.map((key, idx) => (
                              <Radar key={key} name={key} dataKey={key} stroke={chartColors[idx % chartColors.length]} fill={chartColors[idx % chartColors.length]} fillOpacity={0.2} />
                            ))}
                          </RadarChart>
                        </ResponsiveContainer>
                      );
                    case 'donut': {
                      const dData = chartData.map(item => ({ name: item[xAxisKey], value: item[dataKeys && dataKeys[0]] }));
                      return (
                        <>
                          <D3DonutChart data={dData} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-18px' }}>
                            <span className="text-3xl font-extrabold text-coffee-900">{dData[0]?.value || 0}</span>
                            <span className="text-xs font-semibold text-coffee-600 mt-0.5" style={{ maxWidth: '80px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dData[0]?.name || 'Data'}</span>
                          </div>
                        </>
                      );
                    }
                    case 'pie': {
                      const pData = chartData.map(item => ({ name: item[xAxisKey], value: item[dataKeys && dataKeys[0]] }));
                      return <D3PieChart data={pData} />;
                    }
                    default:
                      return <div className="text-coffee-500">Unsupported chart type: {type}</div>;
                  }
                })()}
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
}
