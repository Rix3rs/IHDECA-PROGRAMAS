"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const refetch = () => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => {
        if (d.notifications) {
          setNotifications(d.notifications);
          setUnreadCount(d.unreadCount || 0);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    setCurrentTime(Date.now());
    refetch();
    const interval = setInterval(refetch, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleOpen = () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) refetch();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readAll: true })
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const typeColors: Record<string, string> = {
    lead: "bg-blue-100 text-blue-700",
    purchase: "bg-emerald-100 text-emerald-700",
    material: "bg-amber-100 text-amber-700",
    enrollment: "bg-purple-100 text-purple-700",
  };

  const timeAgo = (date: string) => {
    if (currentTime === null) return "";
    const diff = currentTime - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${Math.floor(hours / 24)}d`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5 text-slate-500 hover:text-accent transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-[24px_24px_24px_0px] shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Notificaciones</h4>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-accent hover:text-primary font-bold flex items-center gap-1 cursor-pointer">
                <CheckCheck className="w-3 h-3" /> Marcar todo leído
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No hay notificaciones</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-4 border-b border-slate-50 transition-colors ${n.read ? "bg-white" : "bg-blue-50/30"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!n.read && <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />}
                      <span className="text-xs font-bold text-primary truncate">{n.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-slate-400">{timeAgo(n.createdAt)}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeColors[n.type] || "bg-slate-100 text-slate-600"}`}>
                          {n.type}
                        </span>
                      </div>
                    </div>
                    {!n.read && (
                      <button onClick={() => handleMarkRead(n.id)} className="text-slate-300 hover:text-accent flex-shrink-0 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
