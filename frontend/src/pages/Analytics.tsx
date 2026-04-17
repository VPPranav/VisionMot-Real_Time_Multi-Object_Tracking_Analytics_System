import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useAnalyticsHistory } from '../hooks/useAnalyticsHistory';
import { Download, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { format } from 'date-fns';

export default function Analytics() {
   const analyticsDataMap = useAnalyticsStore(state => state.data);
   const analyticsData = Object.values(analyticsDataMap);

   // For demo, we'll just pick the first camera's history for the trend chart
   const firstCameraId = Object.keys(analyticsDataMap)[0] || '';
   const { data: history } = useAnalyticsHistory(firstCameraId, '10m');

   const trendData = useMemo(() => {
      if (!history) return [];
      return history.map((h: any) => ({
         time: format(new Date(h.timestamp), 'HH:mm:ss'),
         active: h.active_tracks || 0,
         velocity: h.velocity_avg || 0
      }));
   }, [history]);

   if (analyticsData.length === 0) {
      return (
         <div className="flex h-64 items-center justify-center border border-dashed border-border rounded-xl">
            <p className="text-text-secondary">No analytics data available yet. Please wait for camera feeds to initialize.</p>
         </div>
      );
   }

   // Aggregate class counts across all cameras for demo
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
      trendData.forEach(row => {
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
   const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

   const barData = [
      { name: 'Total Tracked', Vehicles: cumulativeVehicles, Pedestrians: cumulativePedestrians },
   ];

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
               <p className="text-text-secondary mt-1">Aggregated insights across all tracking feeds.</p>
            </div>
            <button
               onClick={exportCSV}
               className="flex items-center space-x-2 px-4 py-2 bg-surface-elevated hover:bg-surface-elevated/80 text-text-primary rounded-lg border border-border transition-colors cursor-pointer"
            >
               <Download size={16} />
               <span>Export CSV</span>
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Class Distribution Pie Chart */}
            <div className="bg-surface/70 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-glass hover:border-primary/30 transition-all">
               <h3 className="text-lg font-bold mb-6">Current Class Distribution</h3>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={pieData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                        >
                           {pieData.map((_entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip
                           contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                           itemStyle={{ color: '#F9FAFB' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Cumulative Totals Bar Chart */}
            <div className="bg-surface/70 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-glass hover:border-primary/30 transition-all">
               <h3 className="text-lg font-bold mb-6">Total Unique Objects Tracked</h3>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={barData}>
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                           contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                           cursor={{ fill: '#1F2937' }}
                        />
                        <Legend />
                        <Bar dataKey="Vehicles" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Pedestrians" fill="#10B981" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* System Load / Activity Trend */}
         <div className="bg-surface/70 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-glass hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold flex items-center space-x-2">
                  <TrendingUp size={20} className="text-primary" />
                  <span>Activity Trends (Global)</span>
               </h3>
            </div>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                     <XAxis dataKey="time" stroke="#9CA3AF" />
                     <YAxis stroke="#9CA3AF" yAxisId="left" />
                     <YAxis stroke="#9CA3AF" yAxisId="right" orientation="right" />
                     <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(8px)', borderColor: '#374151', borderRadius: '12px' }}
                     />
                     <Legend />
                     <Line yAxisId="left" type="monotone" dataKey="active" name="Active Tracks" stroke="#3B82F6" strokeWidth={3} dot={false} />
                     <Line yAxisId="right" type="monotone" dataKey="velocity" name="Avg Velocity" stroke="#F59E0B" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
   );
}
