"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  MapPin, 
  Wallet, 
  AlertTriangle, 
  Plus, 
  Navigation, 
  Settings, 
  Bell,
  TrendingDown,
  Navigation2,
  MessageSquare,
  Send,
  X,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:3001";

export default function TouristDashboard() {
  const [isTripActive, setIsTripActive] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState("SECURE");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Namaste! I'm your Kavach AI. How can I help you explore safely today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { label: "Budget Spent", value: "₹0", icon: Wallet, color: "text-emerald-500" },
    { label: "Alerts Nearby", value: "0", icon: Shield, color: "text-blue-500" },
    { label: "Current Alt", value: "---", icon: Navigation2, color: "text-amber-500" },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Periodic Location Updates (Mocked)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTripActive && currentTripId) {
      interval = setInterval(async () => {
        try {
          await fetch(`${API_BASE}/trips/${currentTripId}/locations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: 32.24 + (Math.random() - 0.5) * 0.01,
              longitude: 77.18 + (Math.random() - 0.5) * 0.01,
              altitude: 2000 + Math.random() * 100
            })
          });
        } catch (err) {
          console.error("Failed to send location update", err);
        }
      }, 10000); // Every 10 seconds
    }
    return () => clearInterval(interval);
  }, [isTripActive, currentTripId]);

  const handleStartTrip = async () => {
    try {
      const res = await fetch(`${API_BASE}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: "Himalayan Expedition",
          userId: "some-user-id" 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentTripId(data.id);
        setIsTripActive(true);
      }
    } catch (err) {
      console.error("Failed to start trip", err);
      // Fallback for demo
      setCurrentTripId("demo-trip-id");
      setIsTripActive(true);
    }
  };

  const handleSOS = async () => {
    if (!isTripActive || !currentTripId) {
      alert("Please start a trip first before using SOS.");
      return;
    }

    setSafetyStatus("CRITICAL");
    try {
      await fetch(`${API_BASE}/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: currentTripId,
          type: "SOS",
          severity: "CRITICAL",
          message: "User triggered Emergency SOS via Mobile App"
        })
      });
      alert("SOS Alert Sent! Authorities have been notified.");
    } catch (err) {
      console.error("Failed to send SOS", err);
      alert("Connection failed. Please use satellite phone or local emergency numbers.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "I'm having trouble connecting to my safety servers. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 pb-24 pt-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Namaste, Arya
              </h1>
              <div className="flex items-center gap-1 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                <Shield className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Verified</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm">Explore safely in Himalayas</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5 text-slate-300" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950" />
            </div>
          </div>
        </header>

        {/* Safety Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 rounded-3xl overflow-hidden group"
        >
          <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-500 ${
            safetyStatus === "SECURE" ? "from-emerald-500/20 to-teal-500/5" : 
            safetyStatus === "WARNING" ? "from-amber-500/20 to-orange-500/5" : 
            "from-rose-500/20 to-red-500/5"
          }`} />
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />
          
          <div className="relative p-6 flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              safetyStatus === "SECURE" ? "bg-emerald-500/20" : 
              safetyStatus === "WARNING" ? "bg-amber-500/20" : "bg-rose-500/20"
            }`}>
              <Shield className={`w-8 h-8 ${
                safetyStatus === "SECURE" ? "text-emerald-400" : 
                safetyStatus === "WARNING" ? "text-amber-400" : "text-rose-400"
              }`} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">Safety Status</p>
              <h2 className="text-xl font-bold">
                {safetyStatus === "SECURE" ? "Region is currently stable" : 
                 safetyStatus === "WARNING" ? "Caution: Minor Disturbance" : "Emergency Protocol Active"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  safetyStatus === "SECURE" ? "bg-emerald-400" : 
                  safetyStatus === "WARNING" ? "bg-amber-400" : "bg-rose-400"
                }`} />
                <span className={`text-sm font-medium ${
                  safetyStatus === "SECURE" ? "text-emerald-400" : 
                  safetyStatus === "WARNING" ? "text-amber-400" : "text-rose-400"
                }`}>
                  {safetyStatus === "SECURE" ? "Monitoring active" : 
                   safetyStatus === "WARNING" ? "Higher vigilance advised" : "Rescue teams alerted"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Action */}
        <section className="mb-10">
          <button 
            onClick={isTripActive ? () => setIsTripActive(false) : handleStartTrip}
            className="w-full relative group"
          >
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className={`relative w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 ${
              isTripActive ? "bg-slate-900 border border-slate-800" : "bg-white text-slate-950 font-bold"
            }`}>
              {isTripActive ? (
                <>
                  <Navigation className="w-5 h-5 text-indigo-400" />
                  <span className="text-slate-200">End Current Trip</span>
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6 text-slate-950" />
                  <span>Start New Safety Trip</span>
                </>
              )}
            </div>
          </button>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-slate-900/50 border border-white/5 backdrop-blur-md p-4 rounded-3xl"
            >
              <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Safety Tools */}
        <section>
          <h3 className="text-lg font-bold mb-5">Safety Toolkit</h3>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="bg-gradient-to-br from-rose-500/20 to-slate-900 border border-rose-500/20 p-5 rounded-3xl group cursor-pointer"
              onClick={handleSOS}
            >
              <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <h4 className="font-bold text-slate-200">Emergency SOS</h4>
              <p className="text-[10px] text-slate-400 mt-1">Instant local authority alert</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/20 to-slate-900 border border-indigo-500/20 p-5 rounded-3xl group cursor-pointer" onClick={() => setShowChat(true)}>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <h4 className="font-bold text-slate-200">Kavach Chat</h4>
              <p className="text-[10px] text-slate-400 mt-1">AI Safety & Budget Advisor</p>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Chatbot UI */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-x-4 bottom-24 z-[100] max-w-sm mx-auto"
          >
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col h-[500px] overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-indigo-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Kavach Advisor</h3>
                    <p className="text-[10px] text-emerald-400 font-medium">Online • Safety Specialist</p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user" 
                        ? "bg-indigo-500 text-white rounded-tr-none" 
                        : "bg-white/5 text-slate-200 rounded-tl-none border border-white/5"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/5 bg-slate-900/50">
                <div className="relative flex items-center gap-2">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask about safety, weather, or budget..."
                    className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                  <button 
                    onClick={sendMessage}
                    className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center hover:bg-indigo-400 transition-transform active:scale-95"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar Alternative */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-around px-8 z-50">
        <HomeIcon className="w-6 h-6 text-indigo-400" />
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center -mt-8 shadow-lg shadow-indigo-500/40 cursor-pointer">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <Settings className="w-6 h-6 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer" />
      </nav>
    </div>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
