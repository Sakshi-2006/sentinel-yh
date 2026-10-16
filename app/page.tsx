'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronDown,
  CircleHelp,
  Cpu,
  Gauge,
  LayoutDashboard,
  LineChart,
  ListFilter,
  MapPin,
  MoreHorizontal,
  Plus,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
  X,
} from 'lucide-react'

const machines = [
  { name: 'CNC Mill · Line A', id: 'CNC-042', site: 'Detroit Plant', score: 94, status: 'Healthy', temp: '68.4°C', vibration: '2.1 mm/s', risk: 'Low' },
  { name: 'Hydraulic Press · 03', id: 'PRS-118', site: 'Detroit Plant', score: 71, status: 'Watch', temp: '79.1°C', vibration: '4.8 mm/s', risk: 'Medium' },
  { name: 'Conveyor Motor · B', id: 'CVR-207', site: 'Austin Plant', score: 42, status: 'Critical', temp: '91.7°C', vibration: '8.6 mm/s', risk: 'High' },
  { name: 'Robot Arm · Cell 4', id: 'RBT-031', site: 'Austin Plant', score: 88, status: 'Healthy', temp: '62.3°C', vibration: '1.9 mm/s', risk: 'Low' },
]

const alerts = [
  { title: 'Abnormal vibration detected', machine: 'Conveyor Motor · B', time: '8 min ago', level: 'Critical', icon: Activity },
  { title: 'Temperature trend rising', machine: 'Hydraulic Press · 03', time: '24 min ago', level: 'Warning', icon: AlertTriangle },
  { title: 'Scheduled maintenance due', machine: 'CNC Mill · Line A', time: '2 hr ago', level: 'Info', icon: Wrench },
]

function ScoreRing({ score }: { score: number }) {
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const tone = score > 80 ? 'good' : score > 55 ? 'warn' : 'bad'
  return (
    <div className={`score-ring ${tone}`} aria-label={`Health score ${score} out of 100`}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle className="ring-track" cx="32" cy="32" r={radius} />
        <circle className="ring-value" cx="32" cy="32" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <span>{score}</span>
    </div>
  )
}

function TrendChart({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`trend-chart ${compact ? 'compact' : ''}`}>
      <div className="chart-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
      <svg viewBox="0 0 680 190" preserveAspectRatio="none" role="img" aria-label="Fleet health trend over the last 24 hours">
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity=".28" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient>
        </defs>
        <g className="chart-grid"><line x1="0" y1="15" x2="680" y2="15" /><line x1="0" y1="55" x2="680" y2="55" /><line x1="0" y1="95" x2="680" y2="95" /><line x1="0" y1="135" x2="680" y2="135" /><line x1="0" y1="175" x2="680" y2="175" /></g>
        <path className="chart-area" d="M0,51 C25,46 30,62 56,57 S88,40 112,48 S145,58 168,47 S198,43 224,48 S254,73 280,63 S305,44 336,51 S360,70 388,65 S419,52 448,57 S475,81 505,72 S532,59 560,66 S592,77 616,69 S650,54 680,49 L680,190 L0,190 Z" />
        <path className="chart-line" d="M0,51 C25,46 30,62 56,57 S88,40 112,48 S145,58 168,47 S198,43 224,48 S254,73 280,63 S305,44 336,51 S360,70 388,65 S419,52 448,57 S475,81 505,72 S532,59 560,66 S592,77 616,69 S650,54 680,49" />
        <circle className="chart-dot" cx="505" cy="72" r="4" /><circle className="chart-dot" cx="680" cy="49" r="4" />
      </svg>
      <div className="chart-x-labels"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>Now</span></div>
    </div>
  )
}

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [range, setRange] = useState('24 hours')
  const [showAlert, setShowAlert] = useState(true)
  const [query, setQuery] = useState('')
  const filteredMachines = useMemo(() => machines.filter((m) => `${m.name} ${m.id} ${m.site}`.toLowerCase().includes(query.toLowerCase())), [query])

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Radio /></div><div><strong>sentinel<span>.ai</span></strong><small>Predictive operations</small></div></div>
        <div className="workspace"><div className="workspace-avatar">AP</div><div><strong>Atlas Production</strong><small>Operations workspace</small></div><ChevronDown /></div>
        <nav className="nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {[['Overview', LayoutDashboard], ['Fleet health', Gauge], ['Analytics', LineChart], ['Maintenance', Wrench]].map(([label, Icon]) => <button key={label as string} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => setActive(label as string)}><Icon />{label as string}{label === 'Fleet health' && <span className="nav-count">12</span>}</button>)}
          <p className="nav-label">Manage</p>
          {[['Sites & assets', MapPin], ['Reports', BarChart3], ['Settings', Settings]].map(([label, Icon]) => <button key={label as string} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => setActive(label as string)}><Icon />{label as string}</button>)}
        </nav>
        <div className="sidebar-footer"><div className="support-card"><CircleHelp /><div><strong>Need a hand?</strong><span>Visit the knowledge base</span></div></div><div className="user-row"><div className="user-avatar">JD</div><div><strong>Jordan Davis</strong><small>Fleet manager</small></div><MoreHorizontal /></div></div>
      </aside>
      <section className="content">
        <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{active}</strong></div><div className="top-actions"><div className="search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assets..." aria-label="Search assets" /><kbd>⌘ K</kbd></div><button className="icon-button" aria-label="Notifications"><Bell /><i /></button><div className="top-avatar">JD</div></div></header>
        <div className="page-wrap">
          {showAlert && <div className="system-alert"><div className="alert-icon"><AlertTriangle /></div><div><strong>1 asset needs attention</strong><p>Conveyor Motor · B has a high probability of failure within the next 7 days.</p></div><button className="alert-action" onClick={() => setActive('Fleet health')}>Review asset</button><button className="close-alert" onClick={() => setShowAlert(false)} aria-label="Dismiss alert"><X /></button></div>}
          <div className="page-heading"><div><p className="eyebrow">Thursday, October 16, 2026 <span className="live-dot" /> Live monitoring</p><h1>Good morning, Jordan</h1><p className="subheading">Here&apos;s the latest from your connected fleet.</p></div><button className="primary-button"><Plus /> Add asset</button></div>
          <div className="metric-grid"><div className="metric-card"><div className="metric-top"><span>Fleet health score</span><span className="metric-icon purple"><ShieldCheck /></span></div><div className="metric-value">84.6<span>/100</span></div><div className="metric-change up">↑ 3.2% <small>vs. last week</small></div><div className="metric-spark purple-spark"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></div><div className="metric-card"><div className="metric-top"><span>Connected assets</span><span className="metric-icon blue"><Cpu /></span></div><div className="metric-value">24<span className="unit"> assets</span></div><div className="metric-change neutral">20 online <small>· 4 idle</small></div><div className="asset-dots"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="metric-card"><div className="metric-top"><span>Open alerts</span><span className="metric-icon orange"><AlertTriangle /></span></div><div className="metric-value">03<span className="unit"> alerts</span></div><div className="metric-change down">↓ 2 <small>since yesterday</small></div><div className="alert-bars"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></div><div className="metric-card"><div className="metric-top"><span>Predicted savings</span><span className="metric-icon green"><BarChart3 /></span></div><div className="metric-value">$28.4<span className="unit">k</span></div><div className="metric-change up">↑ 12.8% <small>this quarter</small></div><div className="savings-line"><span>$0</span><div><i /></div><span>$40k</span></div></div></div>
          <div className="section-grid"><section className="panel chart-panel"><div className="panel-heading"><div><h2>Fleet health trend</h2><p>Average health score across all connected assets</p></div><div className="segmented">{['24 hours', '7 days', '30 days'].map((item) => <button key={item} className={range === item ? 'selected' : ''} onClick={() => setRange(item)}>{item}</button>)}</div></div><div className="chart-summary"><strong>84.6</strong><span className="up">↑ 3.2%</span><small>average score</small></div><TrendChart /></section><section className="panel alerts-panel"><div className="panel-heading"><div><h2>Recent alerts</h2><p>Events requiring your attention</p></div><button className="text-button" onClick={() => setActive('Fleet health')}>View all <span>→</span></button></div><div className="alert-list">{alerts.map(({ title, machine, time, level, icon: Icon }) => <div className="alert-row" key={title}><div className={`alert-type ${level.toLowerCase()}`}><Icon /></div><div className="alert-copy"><strong>{title}</strong><span>{machine} · {time}</span></div><span className={`status-pill ${level.toLowerCase()}`}>{level}</span></div>)}</div></section></div>
          <section className="panel machine-panel"><div className="panel-heading"><div><h2>Asset health</h2><p>Monitor performance and maintenance risk across your fleet</p></div><div className="table-actions"><button className="secondary-button"><ListFilter /> Filter</button><button className="secondary-button"><SlidersHorizontal /> Columns</button></div></div><div className="table-wrap"><table><thead><tr><th>Asset</th><th>Health score</th><th>Status</th><th>Temperature</th><th>Vibration</th><th>Failure risk</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filteredMachines.map((machine) => <tr key={machine.id}><td><div className="asset-cell"><div className="asset-icon"><Cpu /></div><div><strong>{machine.name}</strong><span>{machine.id} · {machine.site}</span></div></div></td><td><div className="score-cell"><ScoreRing score={machine.score} /><span>{machine.score > 80 ? 'Excellent' : machine.score > 55 ? 'Needs review' : 'Immediate action'}</span></div></td><td><span className={`status-pill ${machine.status.toLowerCase()}`}><i />{machine.status}</span></td><td><span className={machine.score < 55 ? 'critical-value' : ''}>{machine.temp}</span></td><td><span className={machine.score < 55 ? 'critical-value' : ''}>{machine.vibration}</span></td><td><span className={`risk-text ${machine.risk.toLowerCase()}`}>{machine.risk}</span></td><td><button className="row-menu" aria-label={`Actions for ${machine.name}`}><MoreHorizontal /></button></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing {filteredMachines.length} of 24 assets</span><button className="text-button" onClick={() => setActive('Fleet health')}>View fleet <span>→</span></button></div></section>
          <footer className="page-footer"><span><span className="live-dot" /> All systems operational</span><span>Last updated just now · Data refreshes every 5 minutes</span></footer>
        </div>
      </section>
    </main>
  )
}
