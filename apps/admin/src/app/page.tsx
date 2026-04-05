"use client";

import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Map as MapIcon, 
  Users, 
  AlertCircle, 
  Bell, 
  Search, 
  Filter,
  MoreVertical,
  Activity,
  ArrowUpRight,
  Navigation,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = "https://travelshield-1-tiw2.onrender.com/alerts";

export default function AdminDashboard() {
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [activeTourists, setActiveTourists] = useState(1);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {

        const res = await fetch(`${API_BASE}/alerts`);
        if (res.ok) {
          const data = await res.json();
          setAlerts(data);
          setActiveAlertsCount(data.filter((a: any) => a.status === 'OPEN').length);
        }
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const sidebarItems = [
    { name: "Overview", icon: Activity, active: true },
    { name: "Safety Map", icon: MapIcon },
    { name: "Live Tourists", icon: Users },
    { name: "Alert Center", icon: AlertCircle },
    { name: "Admin Settings", icon: Shield },
  ];

  const regions = [
    { name: "Himachal Pradesh", status: "STABLE", active: 450, alerts: 2 },
    { name: "Ladakh", status: "STABLE", active: 230, alerts: 1 },
    { name: "Uttarakhand", status: "MODERATE", active: 310, alerts: 5 },
    { name: "Sikkim", status: "STABLE", active: 180, alerts: 0 },
  ];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    return `${Math.round(diffMin / 60)} hours ago`;
  };

  return (
    <div className="flex h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Kavach Admin</h1>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button 
                key={item.name}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  item.active 
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8">
          <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 p-4 rounded-2xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">System Status</h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">All Microservices Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl px-10 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search tourists, regions, or alerts..."
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold">Admin Authority</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Regional Command</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111111] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
              <Users className="w-8 h-8 text-indigo-400 mb-4" />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Tourists</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold">14,250</h3>
                <span className="text-emerald-500 text-xs font-bold pb-1 flex items-center gap-1">
                   <ArrowUpRight className="w-3 h-3" /> 12%
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111111] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-3xl group-hover:bg-rose-500/10 transition-colors" />
              <AlertCircle className="w-8 h-8 text-rose-400 mb-4" />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Alerts</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold text-rose-400">{activeAlertsCount}</h3>
                <span className="text-rose-500 text-xs font-bold pb-1 flex items-center gap-1">
                   <ArrowUpRight className="w-3 h-3" /> 5%
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#111111] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              <Navigation className="w-8 h-8 text-blue-400 mb-4" />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Rescue Ops</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold">3</h3>
                <span className="text-emerald-500 text-xs font-bold pb-1 flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3" /> Stable
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#111111] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
              <Shield className="w-8 h-8 text-emerald-400 mb-4" />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Safety Index</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold">98.2%</h3>
                <span className="text-emerald-500 text-xs font-bold pb-1 flex items-center gap-1">
                   <ArrowUpRight className="w-3 h-3" /> 0.3%
                </span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Live Anomalies Table */}
            <div className="col-span-2 bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Real-time Anomaly Detection</h3>
                  <p className="text-xs text-slate-500 uppercase font-medium tracking-wider mt-1">Live AI Monitoring (Himalayan Regions)</p>
                </div>
                <button className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors">
                  <Filter className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="p-0">
                <table className="w-full">
                  <thead className="bg-white/[0.02] border-b border-white/5">
                    <tr>
                      <th className="text-left py-4 px-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tourist</th>
                      <th className="text-left py-4 px-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Region</th>
                      <th className="text-left py-4 px-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Issue</th>
                      <th className="text-left py-4 px-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Severity</th>
                      <th className="text-left py-4 px-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {alerts.map((alert: any) => (
                      <tr key={alert.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10" />
                            <span className="text-sm font-semibold">{alert.trip?.user?.name || "Guest Tourist"}</span>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-sm text-slate-400">{alert.trip?.title || "Unknown Region"}</td>
                        <td className="py-5 px-8">
                          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md">{alert.type}</span>
                        </td>
                        <td className="py-5 px-8">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                            alert.severity === "CRITICAL" ? "bg-rose-500/10 text-rose-400" : 
                            alert.severity === "HIGH" ? "bg-orange-500/10 text-orange-400" :
                            "bg-blue-500/10 text-blue-400"
                          }`}>{alert.severity}</span>
                        </td>
                        <td className="py-5 px-8 text-sm text-slate-500 font-medium">{formatTime(alert.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Regional Health Card */}
            <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold mb-6">Regional Safety Health</h3>
              <div className="space-y-6">
                {regions.map((region) => (
                  <div key={region.name} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{region.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        region.status === "STABLE" ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                      }`}>{region.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          region.status === "STABLE" ? "bg-emerald-500" : "bg-orange-500"
                        }`}
                        style={{ width: `${region.status === "STABLE" ? "85%" : "45%"}` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>{region.active} Active Tourists</span>
                      <span>{region.alerts} Alerts</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-8 py-4 bg-white text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                 Full Regional Analysis <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
