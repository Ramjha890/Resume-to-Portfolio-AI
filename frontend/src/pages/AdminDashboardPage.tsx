import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { AdminStats } from '../types';
import { 
  Shield, Users, FileText, Globe, Eye, Activity, CheckCircle2, 
  ExternalLink, Clock, RefreshCw 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsData, portfoliosData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPortfolios()
      ]);
      setStats(statsData);
      setPortfolios(portfoliosData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-black pb-24">
      {/* Admin Top Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  SUPERUSER ACCESS
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white mt-1">Platform Admin Dashboard</h1>
            </div>
          </div>
          <button
            onClick={fetchAdminData}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center space-x-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-10 space-y-10">

        {/* 5 Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-400" />
                <span>Users</span>
              </span>
              <p className="text-3xl font-black text-white mt-3">{stats.total_users}</p>
              <span className="text-xs text-slate-400 mt-1 block">Registered accounts</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Resumes</span>
              </span>
              <p className="text-3xl font-black text-indigo-400 mt-3">{stats.total_resumes}</p>
              <span className="text-xs text-slate-400 mt-1 block">Uploaded & analyzed</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Portfolios</span>
              </span>
              <p className="text-3xl font-black text-purple-400 mt-3">{stats.total_portfolios}</p>
              <span className="text-xs text-slate-400 mt-1 block">Generated sites</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Published</span>
              </span>
              <p className="text-3xl font-black text-emerald-400 mt-3">{stats.total_published_portfolios}</p>
              <span className="text-xs text-slate-400 mt-1 block">Publicly accessible</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Total Views</span>
              </span>
              <p className="text-3xl font-black text-amber-400 mt-3">{stats.total_views}</p>
              <span className="text-xs text-slate-400 mt-1 block">Visitor impressions</span>
            </div>
          </div>
        )}

        {/* Global Portfolios Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">All Platform Portfolios</h2>
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase font-mono text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">Portfolio Name</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Template</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Views</th>
                    <th className="p-4">Slug & Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {portfolios.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white">{p.portfolio_name}</td>
                      <td className="p-4 text-slate-400">
                        {p.user_name} <br />
                        <span className="text-xs text-slate-500">{p.user_email}</span>
                      </td>
                      <td className="p-4 font-mono text-xs text-brand-300">{p.template_id}</td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                          p.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {p.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 font-mono">{p.visitor_count}</td>
                      <td className="p-4">
                        {p.is_published ? (
                          <a
                            href={`/portfolio/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-400 hover:underline flex items-center gap-1 font-mono text-xs"
                          >
                            <span>/{p.slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="font-mono text-xs text-slate-500">/{p.slug}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Two Columns: Recent Registrations & Activity Logs */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Recent Registrations</h2>
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 divide-y divide-slate-800 overflow-hidden">
                {stats.recent_registrations.map((u) => (
                  <div key={u.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{u.full_name}</span>
                        {u.is_admin && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/20 text-amber-300">
                            Admin
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <span>{u.portfolio_count} portfolios</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">System Activity Stream</h2>
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 divide-y divide-slate-800 overflow-hidden">
                {stats.recent_activity.map((act) => (
                  <div key={act.id} className="p-4 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] font-bold uppercase text-brand-300">
                        {act.activity_type}
                      </span>
                      <span className="text-slate-500">
                        {act.created_at ? new Date(act.created_at).toLocaleTimeString() : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
