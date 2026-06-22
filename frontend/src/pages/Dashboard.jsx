import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Users,
  DollarSign,
  IndianRupee,
  Wallet,
  Clock,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '../utils/cn';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, trendValue, iconBg, trendType }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft relative overflow-hidden group hover:shadow-premium transition-all duration-300">
    <div className="flex flex-col h-full justify-between gap-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-xl flex items-center justify-center shrink-0 shadow-sm", iconBg)}>
            <Icon className={cn(iconBg.includes('text-') ? "" : "text-white")} size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest truncate opacity-80">{title}</p>
            <h3 className="text-[21px] font-black text-textPrimary leading-none mt-1 truncate tracking-tight">{value}</h3>
          </div>
        </div>
        <button className="p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
          <MoreVertical size={14} />
        </button>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-50/50">
        <div className={cn(
          "flex items-center px-2 py-0.5 rounded-lg font-black text-[9px] tracking-tight",
          trendType === 'up' ? "bg-secondary/10 text-secondary" : "bg-danger/10 text-danger"
        )}>
          {trendType === 'up' ? <ArrowUp size={10} className="mr-0.5" /> : <ArrowDown size={10} className="mr-0.5" />}
          {trendValue}%
        </div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-70">vs last month</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState('monthly');

  useEffect(() => {
    fetchDashboardData();
  }, [chartView]);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get(`/dashboard/stats?view=${chartView}`);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue?.toLocaleString()}`}
          icon={Wallet}
          trendValue={12.5}
          trendType="up"
          iconBg="bg-primary/10 !text-primary"
        />
        <StatCard
          title="Pending Amount"
          value={`₹${stats?.totalPending?.toLocaleString()}`}
          icon={Clock}
          trendValue={8.2}
          trendType="down"
          iconBg="bg-[#F59E0B]/10 !text-warning"
        />
        <StatCard
          title="Total Students"
          value={stats?.totalStudents}
          icon={Users}
          trendValue={10.3}
          trendType="up"
          iconBg="bg-[#22C55E]/10 !text-secondary"
        />
        <StatCard
          title="Today's Collection"
          value={`₹${stats?.todayCollection?.toLocaleString()}`}
          icon={IndianRupee}
          trendValue={15.3}
          trendType="up"
          iconBg="bg-[#06B6D4]/10 !text-[#06B6D4]"
        />
      </div>

      {/* Revenue Overview Chart */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-xl font-black text-textPrimary tracking-tight">Revenue Overview</h4>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 p-1 rounded-2xl flex border border-gray-100">
              <button
                onClick={() => setChartView('weekly')}
                className={cn(
                  "px-6 py-2 text-[10px] font-black rounded-xl transition-all",
                  chartView === 'weekly' ? "bg-white text-[#0EA5E9] shadow-sm" : "text-gray-400"
                )}
              >
                Weekly
              </button>
              <button
                onClick={() => setChartView('monthly')}
                className={cn(
                  "px-6 py-2 text-[10px] font-black rounded-xl transition-all",
                  chartView === 'monthly' ? "bg-white text-[#0EA5E9] shadow-sm" : "text-gray-400"
                )}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="h-[280px] w-full pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F8FAFC" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                tickFormatter={(value) => `₹${value >= 100000 ? value / 100000 + 'L' : value / 1000 + 'K'}`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px 20px' }}
                itemStyle={{ fontWeight: 900, color: '#0EA5E9' }}
                labelStyle={{ fontWeight: 700, marginBottom: '4px' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0EA5E9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRev)"
                dot={{ r: 4, fill: '#0EA5E9', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#0EA5E9', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-black text-textPrimary tracking-tight">Recent Transactions</h4>
          <Link to="/reports" className="text-[#0EA5E9] text-xs font-black uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1.5">
            View All <ChevronRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Receipt ID</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Student Name</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Course</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Amount</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Status</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentTransactions?.map((txn) => (
                <tr key={txn._id} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6 text-[13px] font-bold text-textPrimary">{txn.receiptNumber}</td>
                  <td className="py-4 px-6 text-[13px] font-bold text-textSecondary">{txn.student?.name}</td>
                  <td className="py-4 px-6 text-[13px] font-bold text-textSecondary">{txn.course || '—'}</td>
                  <td className="py-4 px-6 text-[13px] font-black text-textPrimary whitespace-nowrap">₹{txn.amount?.toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={cn(
                      "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                      txn.status === 'Paid' || !txn.status ? "bg-secondary/10 text-secondary border-secondary/20" :
                        txn.status === 'Partial' ? "bg-warning/10 text-warning border-warning/20" :
                          "bg-danger/10 text-danger border-danger/20"
                    )}>
                      {txn.status || 'Paid'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-bold text-textSecondary whitespace-nowrap">{format(new Date(txn.createdAt), 'dd MMM yyyy')}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-gray-300 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/5 rounded-lg transition-all">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {(!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-textSecondary font-medium">No recent transactions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
