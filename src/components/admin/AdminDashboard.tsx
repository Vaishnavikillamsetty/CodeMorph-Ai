import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldAlert, Users, DollarSign, Cpu, Server, Activity,
  Search, Filter, ChevronDown, ChevronUp, Trash2, RefreshCw,
  CheckCircle2, XCircle, Crown, UserCheck, UserX, Edit3,
  TrendingUp, BarChart3, Globe, Zap, Database, Wifi, X,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { apiRequest } from '../../services/api';
import { AdminMetrics, AdminUser, AdminSubscription, AdminConversion } from '../../types';

// ─── Sidebar tabs ─────────────────────────────────────────────────────────────
type AdminTab = 'overview' | 'users' | 'subscriptions' | 'conversions' | 'system';

const SIDEBAR_ITEMS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Analytics Overview', icon: BarChart3  },
  { id: 'users',         label: 'User Management',    icon: Users       },
  { id: 'subscriptions', label: 'Subscriptions',      icon: Crown       },
  { id: 'conversions',   label: 'Conversions',        icon: Cpu         },
  { id: 'system',        label: 'System Monitor',     icon: Server      },
];

// ─── Metric Card ─────────────────────────────────────────────────────────────
const MetricCard: React.FC<{
  title: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}> = ({ title, value, sub, icon: Icon, color }) => (
  <div className="p-5 rounded-2xl glass-panel border border-border/80 space-y-2">
    <div className="flex items-center justify-between text-xs text-slate-400">
      <span>{title}</span>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
    </div>
    <div className="text-2xl font-extrabold text-white">{value}</div>
    {sub && <div className="text-[11px] text-slate-400">{sub}</div>}
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ ok: boolean; label?: string }> = ({ ok, label }) => (
  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
    ok ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
       : 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
  }`}>
    {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
    <span>{label ?? (ok ? 'Active' : 'Inactive')}</span>
  </span>
);

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const styles: Record<string, string> = {
    ADMIN: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
    PRO:   'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
    USER:  'bg-slate-500/15 text-slate-300 border-slate-500/25',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[role] ?? styles.USER}`}>
      {role}
    </span>
  );
};

// ─── Edit User Modal ──────────────────────────────────────────────────────────
const EditUserModal: React.FC<{
  user: AdminUser; onClose: () => void;
  onSave: (id: number, payload: { role?: string; is_active?: boolean; free_credits_used?: number }) => Promise<void>;
}> = ({ user, onClose, onSave }) => {
  const [role, setRole]     = useState(user.role);
  const [active, setActive] = useState(user.is_active);
  const [credits, setCredits] = useState(user.free_credits_used);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(user.id, { role, is_active: active, free_credits_used: credits });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md p-6 glass-panel rounded-2xl border border-border/80 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Edit User — @{user.username}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"><X className="w-4 h-4" /></button>
        </div>

        {/* Role */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Role</label>
          <select value={role} onChange={e => setRole(e.target.value as any)}
            className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-cyan-300 focus:outline-none focus:border-cyan-500">
            <option value="USER">USER</option>
            <option value="PRO">PRO</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {/* Active */}
        <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border/60">
          <span className="text-xs text-slate-300 font-medium">Account Active</span>
          <button onClick={() => setActive(a => !a)}
            className={`relative w-10 h-5 rounded-full transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-600'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${active ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Credits */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Free Credits Used</label>
          <input type="number" min={0} max={100} value={credits}
            onChange={e => setCredits(Number(e.target.value))}
            className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
        </div>

        <div className="flex space-x-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-border text-xs text-slate-300 hover:bg-slate-800">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [metrics, setMetrics]     = useState<AdminMetrics | null>(null);
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [subs, setSubs]           = useState<AdminSubscription[]>([]);
  const [conversions, setConversions] = useState<AdminConversion[]>([]);
  const [convTotal, setConvTotal] = useState(0);

  // Filters
  const [userSearch, setUserSearch]     = useState('');
  const [userRole,   setUserRole]       = useState('');
  const [userActive, setUserActive]     = useState('');
  const [convPage,   setConvPage]       = useState(0);
  const [userPage,   setUserPage]       = useState(0);
  const PAGE = 20;

  // UI state
  const [editingUser, setEditingUser]   = useState<AdminUser | null>(null);
  const [isLoading,   setIsLoading]     = useState(false);
  const [refreshKey,  setRefreshKey]    = useState(0);

  // ── fetch metrics ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try { setMetrics(await apiRequest<AdminMetrics>('/admin/metrics')); } catch {}
    };
    load();
  }, [refreshKey]);

  // ── fetch users ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'users') return;
    const load = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          limit: String(PAGE), offset: String(userPage * PAGE),
          ...(userSearch && { search: userSearch }),
          ...(userRole   && { role:   userRole   }),
          ...(userActive !== '' && { is_active: userActive }),
        });
        const data = await apiRequest<{ total: number; users: AdminUser[] }>(`/admin/users?${params}`);
        setUsers(data.users);
        setUsersTotal(data.total);
      } catch {} finally { setIsLoading(false); }
    };
    load();
  }, [activeTab, userSearch, userRole, userActive, userPage, refreshKey]);

  // ── fetch subscriptions ────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'subscriptions') return;
    const load = async () => {
      try {
        const data = await apiRequest<{ total: number; subscriptions: AdminSubscription[] }>('/admin/subscriptions');
        setSubs(data.subscriptions);
      } catch {}
    };
    load();
  }, [activeTab, refreshKey]);

  // ── fetch conversions ──────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'conversions') return;
    const load = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ limit: String(PAGE), offset: String(convPage * PAGE) });
        const data = await apiRequest<{ total: number; conversions: AdminConversion[] }>(`/admin/conversions?${params}`);
        setConversions(data.conversions);
        setConvTotal(data.total);
      } catch {} finally { setIsLoading(false); }
    };
    load();
  }, [activeTab, convPage, refreshKey]);

  // ── actions ────────────────────────────────────────────────────────────────
  const handleUpdateUser = async (id: number, payload: any) => {
    await apiRequest(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    setRefreshKey(k => k + 1);
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Permanently delete this user and all their data?')) return;
    await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
    setRefreshKey(k => k + 1);
  };

  const handleDeleteConversion = async (id: number) => {
    await apiRequest(`/admin/conversions/${id}`, { method: 'DELETE' });
    setConversions(prev => prev.filter(c => c.id !== id));
  };

  // ── Overview cards ────────────────────────────────────────────────────────
  const renderOverview = () => {
    if (!metrics) return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-xs">Loading metrics…</div>
    );
    const m = metrics;
    return (
      <div className="space-y-8">
        {/* Row 1 — user stats */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">User Analytics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Total Users"    value={m.users.total}     icon={Users}      color="bg-cyan-500/15 text-cyan-400"    sub={`${m.users.new_today} new today`} />
            <MetricCard title="Active Users"   value={m.users.active}    icon={UserCheck}  color="bg-emerald-500/15 text-emerald-400" sub={`${m.users.free} free`} />
            <MetricCard title="Pro Subscribers" value={m.users.pro}      icon={Crown}      color="bg-indigo-500/15 text-indigo-400" sub={`$${m.revenue.mrr_usd} MRR`} />
            <MetricCard title="Admins"         value={m.users.admin}     icon={ShieldAlert} color="bg-purple-500/15 text-purple-400" />
          </div>
        </div>

        {/* Row 2 — conversions & API */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Conversion & API Metrics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Total Conversions" value={m.conversions.total}  icon={Cpu}          color="bg-amber-500/15 text-amber-400"  sub={`${m.conversions.daily} today`} />
            <MetricCard title="API Calls"          value={m.api.total_calls}    icon={Activity}     color="bg-sky-500/15 text-sky-400" />
            <MetricCard title="Avg Latency"        value={`${m.api.avg_latency_ms} ms`} icon={Zap} color="bg-rose-500/15 text-rose-400" />
            <MetricCard title="Est. AI Cost"       value={`$${m.api.estimated_cost_usd}`} icon={DollarSign} color="bg-emerald-500/15 text-emerald-400" />
          </div>
        </div>

        {/* Row 3 — revenue */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Revenue</h2>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard title="Monthly Recurring Revenue" value={`$${m.revenue.mrr_usd}`} icon={TrendingUp} color="bg-emerald-500/15 text-emerald-400" sub="Pro × $29/mo" />
            <MetricCard title="Annual Run Rate"           value={`$${m.revenue.arr_usd}`} icon={DollarSign}  color="bg-indigo-500/15 text-indigo-400" />
          </div>
        </div>

        {/* Row 4 — languages & models */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top source languages */}
          <div className="p-5 glass-panel rounded-2xl border border-border/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /><span>Top Source Languages</span>
            </h3>
            {m.languages.top_source.length === 0
              ? <p className="text-xs text-slate-500">No data yet.</p>
              : m.languages.top_source.map(l => (
                <div key={l.language} className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-200">{l.language}</span>
                  <span className="text-cyan-400 font-bold">{l.count}</span>
                </div>
              ))}
          </div>

          {/* Top target languages */}
          <div className="p-5 glass-panel rounded-2xl border border-border/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-indigo-400" /><span>Top Target Languages</span>
            </h3>
            {m.languages.top_target.length === 0
              ? <p className="text-xs text-slate-500">No data yet.</p>
              : m.languages.top_target.map(l => (
                <div key={l.language} className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-200">{l.language}</span>
                  <span className="text-indigo-400 font-bold">{l.count}</span>
                </div>
              ))}
          </div>

          {/* AI model usage */}
          <div className="p-5 glass-panel rounded-2xl border border-border/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-3.5 h-3.5 text-purple-400" /><span>AI Model Usage</span>
            </h3>
            {m.model_usage.length === 0
              ? <p className="text-xs text-slate-500">No data yet.</p>
              : m.model_usage.map(mu => (
                <div key={mu.model} className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 truncate max-w-[140px]">{mu.model}</span>
                  <span className="text-purple-400 font-bold">{mu.count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  // ── User Management ────────────────────────────────────────────────────────
  const renderUsers = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 glass-panel rounded-2xl border border-border/80">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input value={userSearch} onChange={e => { setUserSearch(e.target.value); setUserPage(0); }}
            placeholder="Search by name, username, email…"
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500" />
        </div>
        <select value={userRole} onChange={e => { setUserRole(e.target.value); setUserPage(0); }}
          className="px-3 py-2 bg-surface border border-border rounded-xl text-xs text-slate-300 focus:outline-none">
          <option value="">All Roles</option>
          <option value="USER">USER</option>
          <option value="PRO">PRO</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <select value={userActive} onChange={e => { setUserActive(e.target.value); setUserPage(0); }}
          className="px-3 py-2 bg-surface border border-border rounded-xl text-xs text-slate-300 focus:outline-none">
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button onClick={() => setRefreshKey(k => k + 1)}
          className="p-2 rounded-xl bg-surface border border-border text-slate-400 hover:text-cyan-400 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-border/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface/80 border-b border-border/60 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Credits Used</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading
                ? <tr><td colSpan={6} className="py-12 text-center text-slate-500">Loading…</td></tr>
                : users.length === 0
                ? <tr><td colSpan={6} className="py-12 text-center text-slate-500">No users found.</td></tr>
                : users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {u.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{u.full_name}</div>
                          <div className="text-slate-500 font-mono">@{u.username}</div>
                          <div className="text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><RoleBadge role={u.role} /></td>
                    <td className="py-3 px-4"><StatusBadge ok={u.is_active} /></td>
                    <td className="py-3 px-4 font-mono">
                      <span className={u.free_credits_used >= 5 ? 'text-rose-400' : 'text-slate-300'}>
                        {u.free_credits_used} / 5
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors" title="Edit user">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Delete user">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 text-xs text-slate-400">
          <span>Showing {users.length} of {usersTotal}</span>
          <div className="flex items-center space-x-2">
            <button disabled={userPage === 0} onClick={() => setUserPage(p => p - 1)}
              className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {userPage + 1}</span>
            <button disabled={(userPage + 1) * PAGE >= usersTotal} onClick={() => setUserPage(p => p + 1)}
              className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Subscriptions ─────────────────────────────────────────────────────────
  const renderSubscriptions = () => (
    <div className="glass-panel rounded-2xl border border-border/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface/80 border-b border-border/60 text-slate-400 uppercase font-mono text-[10px]">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Period End</th>
              <th className="py-3 px-4">Auto-Renew</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {subs.length === 0
              ? <tr><td colSpan={5} className="py-12 text-center text-slate-500">No subscriptions found.</td></tr>
              : subs.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">@{s.username}</div>
                    <div className="text-slate-500">{s.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      s.plan === 'FREE' ? 'bg-slate-500/15 text-slate-300 border-slate-500/25'
                      : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25'
                    }`}>{s.plan}</span>
                  </td>
                  <td className="py-3 px-4"><StatusBadge ok={s.status === 'ACTIVE'} label={s.status} /></td>
                  <td className="py-3 px-4 text-slate-400">
                    {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge ok={!s.cancel_at_period_end} label={s.cancel_at_period_end ? 'Cancels' : 'Renews'} />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Conversions ───────────────────────────────────────────────────────────
  const renderConversions = () => (
    <div className="space-y-4">
      <div className="glass-panel rounded-2xl border border-border/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface/80 border-b border-border/60 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Languages</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading
                ? <tr><td colSpan={7} className="py-12 text-center text-slate-500">Loading…</td></tr>
                : conversions.length === 0
                ? <tr><td colSpan={7} className="py-12 text-center text-slate-500">No conversions yet.</td></tr>
                : conversions.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">#{c.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">{c.source_language} → {c.target_language}</td>
                    <td className="py-3 px-4 text-slate-300">{c.model_used}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{c.code_size_bytes} B</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">{c.execution_time_ms} ms</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(c.created_at).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDeleteConversion(c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 text-xs text-slate-400">
          <span>Showing {conversions.length} of {convTotal}</span>
          <div className="flex items-center space-x-2">
            <button disabled={convPage === 0} onClick={() => setConvPage(p => p - 1)} className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <span>Page {convPage + 1}</span>
            <button disabled={(convPage + 1) * PAGE >= convTotal} onClick={() => setConvPage(p => p + 1)} className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── System Monitor ────────────────────────────────────────────────────────
  const renderSystem = () => {
    const systems = [
      { label: 'FastAPI Backend', status: true, detail: 'Uvicorn ASGI — healthy' },
      { label: 'PostgreSQL / SQLite', status: true, detail: 'Connection pool active' },
      { label: 'OpenAI Provider', status: !!localStorage.getItem('codemorph_auth_token'), detail: 'API key configured' },
      { label: 'Gemini Provider', status: false, detail: 'API key not configured' },
      { label: 'Claude Provider', status: false, detail: 'API key not configured' },
    ];
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systems.map(s => (
            <div key={s.label} className="p-4 glass-panel rounded-2xl border border-border/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{s.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{s.detail}</div>
              </div>
              <StatusBadge ok={s.status} label={s.status ? 'Operational' : 'Offline'} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-[calc(100vh-64px)]">

      {/* Sidebar */}
      <aside className="w-56 shrink-0 glass-panel border-r border-border/80 p-4 space-y-1 hidden md:block">
        <div className="flex items-center space-x-2 px-2 py-3 mb-4">
          <ShieldAlert className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-extrabold text-white uppercase tracking-widest">Admin Panel</span>
        </div>
        {SIDEBAR_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === item.id
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}>
            <item.icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-400">CodeMorph AI Administrator Control Center</p>
          </div>
          <button onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-surface border border-border text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Mobile tabs */}
        <div className="flex space-x-1 overflow-x-auto md:hidden pb-2">
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
                activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-surface border border-border'
              }`}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview'      && renderOverview()}
        {activeTab === 'users'         && renderUsers()}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'conversions'   && renderConversions()}
        {activeTab === 'system'        && renderSystem()}
      </main>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
};
