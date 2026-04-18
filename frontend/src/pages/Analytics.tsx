import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useAnalyticsHistory } from '../hooks/useAnalyticsHistory';
import { Download, TrendingUp, Activity } from 'lucide-react';
import { useMemo } from 'react';
import { format } from 'date-fns';

const CHART_STYLE = {
   tooltip: {
      contentStyle: {
         backgroundColor: 'rgba(10,10,20,0.95)',
         borderColor: 'rgba(255,255,255,0.08)',
         borderRadius: '12px',
         boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
         padding: '8px 12px',
      },
      itemStyle: { color: '#E5E7EB', fontSize: '12px' },
      labelStyle: { color: '#9CA3AF', fontSize: '11px' },
   },
   axis: { stroke: '#374151', fontSize: 11 },
};

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#38BDF8', '#A78BFA'];

export default function Analytics() {
   const analyticsDataMap = useAnalyticsStore(state => state.data);
   const analyticsData = Object.values(analyticsDataMap);

   const firstCameraId = Object.keys(analyticsDataMap)[0] || '';
   const { data: history } = useAnalyticsHistory(firstCameraId, '10m');

   const trendData = useMemo(() => {
      if (!history) return [];
      return history.map((h: any) => ({
         time: format(new Date(h.timestamp), 'HH:mm:ss'),
         active: h.active_tracks || 0,
         velocity: h.velocity_avg || 0,
      }));
   }, [history]);

   if (analyticsData.length === 0) {
      return (
         <div className="flex h-72 items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/2">
            <div className="text-center">
               <Activity size={32} className="text-indigo-400/50 mx-auto mb-3" />
               <p className="text-text-secondary font-medium">No analytics data yet</p>
               <p className="text-text-secondary/60 text-sm mt-1">Waiting for camera feeds to initialize.</p>
            </div>
         </div>
      );
   }

   const aggregatedClasses: Record<string, number> = {};
   let cumulativeVehicles = 0;
   let cumulativePedestrians = 0;

   analyticsData.forEach(d => {
      if (d.class_counts) {
         Object.entries(d.class_counts).forEach(([cls, count]) => {
            aggregatedClasses[cls] = (aggregatedClasses[cls] || 0) + count;
         });
      }
      if (d.cumulative_classes) {
         cumulativeVehicles += (d.cumulative_classes.car || 0) + (d.cumulative_classes.motorcycle || 0) + (d.cumulative_classes.bus || 0) + (d.cumulative_classes.truck || 0);
         cumulativePedestrians += d.cumulative_classes.person || 0;
      }
   });

   const exportCSV = () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Time,Active Tracks,Velocity\n";
      trendData.forEach((row: any) => {
         csvContent += `${row.time},${row.active},${row.velocity}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "system_analytics_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const pieData = Object.entries(aggregatedClasses).map(([name, value]) => ({ name, value }));
   const barData = [{ name: 'Tracked', Vehicles: cumulativeVehicles, Pedestrians: cumulativePedestrians }];

   const totalObjects = Object.values(aggregatedClasses).reduce((s, v) => s + v, 0);

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-start justify-between gap-4">
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-400 tracking-widest uppercase">Analytics</span>
               </div>
               <h1 className="text-3xl font-black tracking-tight text-white">System Analytics</h1>
               <p className="text-text-secondary mt-1 text-sm">Aggregated insights across all tracking feeds.</p>
            </div>
            <button
               onClick={exportCSV}
               className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/8 text-text-secondary hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-all text-sm font-medium cursor-pointer"
            >
               <Download size={15} />
               <span>Export CSV</span>
            </button>
         </div>

         {/* Quick stat pills */}
         <div className="grid grid-cols-3 gap-3">
            {[
               { label: 'Total Objects', value: totalObjects, color: 'indigo' },
               { label: 'Vehicles', value: cumulativeVehicles, color: 'sky' },
               { label: 'Pedestrians', value: cumulativePedestrians, color: 'emerald' },
            ].map((s, i) => (
               <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all">
                  <div className={`text-2xl font-black text-white mb-0.5`}>{s.value}</div>
                  <div className="text-xs text-text-secondary font-medium">{s.label}</div>
               </div>
            ))}
         </div>

         {/* Charts row */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Pie */}
            <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/8 p-6 hover:border-indigo-500/20 transition-all">
               <h3 className="text-base font-bold text-white mb-1">Current Class Distribution</h3>
               <p className="text-xs text-text-secondary mb-5">Live breakdown of detected object types</p>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" strokeWidth={0}>
                           {pieData.map((_entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip {...CHART_STYLE.tooltip} />
                        <Legend
                           verticalAlign="bottom"
                           height={36}
                           formatter={(value) => <span style={{ color: '#9CA3AF', fontSize: 11 }}>{value}</span>}
                        />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Bar */}
            <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/8 p-6 hover:border-indigo-500/20 transition-all">
               <h3 className="text-base font-bold text-white mb-1">Total Unique Objects Tracked</h3>
               <p className="text-xs text-text-secondary mb-5">Cumulative count since session start</p>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={barData} barGap={8}>
                        <XAxis dataKey="name" stroke={CHART_STYLE.axis.stroke} fontSize={CHART_STYLE.axis.fontSize} />
                        <YAxis stroke={CHART_STYLE.axis.stroke} fontSize={CHART_STYLE.axis.fontSize} />
                        <Tooltip {...CHART_STYLE.tooltip} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        <Legend formatter={(value) => <span style={{ color: '#9CA3AF', fontSize: 11 }}>{value}</span>} />
                        <Bar dataKey="Vehicles" fill="#6366F1" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Pedestrians" fill="#10B981" radius={[6, 6, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Trend line */}
         <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/8 p-6 hover:border-indigo-500/20 transition-all">
            <div className="flex items-center justify-between mb-1">
               <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-400" />
                  Activity Trends (Global)
               </h3>
            </div>
            <p className="text-xs text-text-secondary mb-5">Active track count and average velocity over time</p>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                     <XAxis dataKey="time" stroke={CHART_STYLE.axis.stroke} fontSize={CHART_STYLE.axis.fontSize} />
                     <YAxis stroke={CHART_STYLE.axis.stroke} fontSize={CHART_STYLE.axis.fontSize} yAxisId="left" />
                     <YAxis stroke={CHART_STYLE.axis.stroke} fontSize={CHART_STYLE.axis.fontSize} yAxisId="right" orientation="right" />
                     <Tooltip {...CHART_STYLE.tooltip} />
                     <Legend formatter={(value) => <span style={{ color: '#9CA3AF', fontSize: 11 }}>{value}</span>} />
                     <Line yAxisId="left" type="monotone" dataKey="active" name="Active Tracks" stroke="#6366F1" strokeWidth={2.5} dot={false} />
                     <Line yAxisId="right" type="monotone" dataKey="velocity" name="Avg Velocity" stroke="#F59E0B" strokeWidth={2} dot={false} strokeDasharray="6 3" />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
   );
}