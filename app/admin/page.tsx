'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { SiteContent, MenuItem, Reservation } from '@/lib/supabase'

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function Ico({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
      <path d={d} />
    </svg>
  )
}
const D = {
  edit:    'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  check:   'M20 6L9 17l-5-5',
  x:       'M18 6 6 18M6 6l12 12',
  plus:    'M12 5v14M5 12h14',
  trash:   'M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  logout:  'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  eye:     'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeoff:  'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22',
  content: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  menu:    'M3 12h18M3 6h18M3 18h18',
  cal:     'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
}

// ─── Section config ───────────────────────────────────────────────────────────
const SECTIONS = [
  { section: 'hero', label: 'Hero', fields: [
    { key: 'headline',  label: 'Headline',  multi: false },
    { key: 'address',   label: 'Address',   multi: false },
    { key: 'tagline',   label: 'Tagline',   multi: false },
  ]},
  { section: 'concept', label: 'The Concept', fields: [
    { key: 'headline',  label: 'Headline',  multi: false },
    { key: 'body',      label: 'Body Text', multi: true  },
  ]},
  { section: 'secret', label: 'Secret Creation', fields: [
    { key: 'headline',    label: 'Headline',    multi: false },
    { key: 'subtitle',    label: 'Subtitle',    multi: false },
    { key: 'description', label: 'Description', multi: true  },
  ]},
  { section: 'footer', label: 'Footer', fields: [
    { key: 'address',           label: 'Address',           multi: false },
    { key: 'hours',             label: 'Hours',             multi: false },
    { key: 'reservations_note', label: 'Reservations Note', multi: false },
  ]},
]

const CATEGORIES = [
  'Raw / Sea','Meat','Vegetarian',"Chef's Specials",
  'Dessert','Signature Cocktails','Classic Cocktails','Spirits','Non-Alcoholic',
]

const STATUS_STYLE: Record<string, string> = {
  new:       'color: #F4C485; border-color: rgba(244,196,133,0.25); background: rgba(244,196,133,0.06);',
  confirmed: 'color: rgba(180,240,200,0.8); border-color: rgba(120,200,140,0.2); background: rgba(80,180,100,0.06);',
  cancelled: 'color: rgba(220,130,130,0.7); border-color: rgba(200,80,80,0.2); background: rgba(180,60,60,0.06);',
}

// ─── Shared styled input ──────────────────────────────────────────────────────
function Field({ label, value, onChange, multiline = false }: {
  label: string; value: string
  onChange: (v: string) => void; multiline?: boolean
}) {
  return (
    <div className="ap-field">
      <label className="ap-label">{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} className="ap-input ap-textarea" />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} className="ap-input" />
      }
    </div>
  )
}

// ─── SaveButton ───────────────────────────────────────────────────────────────
function SaveBtn({ onClick, saved, saving }: { onClick: () => void; saved: boolean; saving?: boolean }) {
  return (
    <button onClick={onClick} disabled={saving} className={`ap-save-btn ${saved ? 'ap-save-btn--saved' : ''}`}>
      {saved ? <><Ico d={D.check} size={11} /><span>Saved</span></> : <span>Save</span>}
    </button>
  )
}

// ─── ContentTab ──────────────────────────────────────────────────────────────
function ContentTab() {
  const [content, setContent] = useState<Record<string, Record<string, string>>>({})
  const [saved, setSaved]     = useState<Record<string, boolean>>({})
  const [saving, setSaving]   = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/admin/api/content').then(r => r.json()).then((rows: SiteContent[]) => {
      const map: Record<string, Record<string, string>> = {}
      rows.forEach(r => { if (!map[r.section]) map[r.section] = {}; map[r.section][r.key] = r.value ?? '' })
      setContent(map); setLoading(false)
    })
  }, [])

  function change(section: string, key: string, value: string) {
    setContent(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }))
    setSaved(prev => ({ ...prev, [`${section}.${key}`]: false }))
  }

  async function save(section: string, key: string) {
    const k = `${section}.${key}`
    setSaving(prev => ({ ...prev, [k]: true }))
    await fetch('/admin/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, key, value: content[section]?.[key] ?? '' }),
    })
    setSaving(prev => ({ ...prev, [k]: false }))
    setSaved(prev => ({ ...prev, [k]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [k]: false })), 2200)
  }

  if (loading) return <div className="ap-loading">Loading content…</div>

  return (
    <div className="ap-content-grid">
      {SECTIONS.map(sec => (
        <div key={sec.section} className="ap-card">
          <div className="ap-card-head">
            <span className="ap-card-num">0{SECTIONS.indexOf(sec) + 1}</span>
            <h3 className="ap-card-title">{sec.label}</h3>
          </div>
          <div className="ap-card-body">
            {sec.fields.map(f => {
              const k = `${sec.section}.${f.key}`
              return (
                <div key={f.key} className="ap-field-row">
                  <div className="ap-field-row-head">
                    <label className="ap-label">{f.label}</label>
                    <SaveBtn onClick={() => save(sec.section, f.key)} saved={!!saved[k]} saving={!!saving[k]} />
                  </div>
                  {f.multi
                    ? <textarea rows={3} value={content[sec.section]?.[f.key] ?? ''} onChange={e => change(sec.section, f.key, e.target.value)} className="ap-input ap-textarea" />
                    : <input type="text" value={content[sec.section]?.[f.key] ?? ''} onChange={e => change(sec.section, f.key, e.target.value)} className="ap-input" />
                  }
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── MenuTab ─────────────────────────────────────────────────────────────────
function MenuTab() {
  const [items, setItems]           = useState<MenuItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeCat, setActiveCat]   = useState(CATEGORIES[0])
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editData, setEditData]     = useState<Partial<MenuItem>>({})
  const [showAdd, setShowAdd]       = useState(false)
  const [newItem, setNewItem]       = useState({ name: '', description: '', price: '' })

  const load = useCallback(() => {
    fetch('/admin/api/menu').then(r => r.json()).then((d: MenuItem[]) => { setItems(d); setLoading(false) })
  }, [])
  useEffect(() => { load() }, [load])

  const filtered = items.filter(i => i.category === activeCat)

  async function saveEdit(id: string) {
    await fetch('/admin/api/menu', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...editData }) })
    setEditingId(null); load()
  }
  async function del(id: string) {
    if (!confirm('Remove this item?')) return
    await fetch('/admin/api/menu', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }
  async function add() {
    if (!newItem.name.trim()) return
    await fetch('/admin/api/menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      category: activeCat, name: newItem.name, description: newItem.description,
      price: newItem.price ? parseFloat(newItem.price) : null,
      sort_order: items.filter(i => i.category === activeCat).length + 1,
    })})
    setNewItem({ name: '', description: '', price: '' }); setShowAdd(false); load()
  }
  async function toggleActive(item: MenuItem) {
    await fetch('/admin/api/menu', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, active: !item.active }) })
    load()
  }

  if (loading) return <div className="ap-loading">Loading menu…</div>

  return (
    <div className="ap-menu-wrap">
      {/* Category pills */}
      <div className="ap-cats">
        {CATEGORIES.map(cat => {
          const n = items.filter(i => i.category === cat).length
          return (
            <button key={cat} onClick={() => setActiveCat(cat)} className={`ap-cat ${activeCat === cat ? 'ap-cat--active' : ''}`}>
              {cat}
              <span className="ap-cat-count">{n}</span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="ap-card">
        <div className="ap-card-head ap-card-head--row">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span className="ap-card-num">{CATEGORIES.indexOf(activeCat) + 1 < 10 ? `0${CATEGORIES.indexOf(activeCat) + 1}` : CATEGORIES.indexOf(activeCat) + 1}</span>
            <h3 className="ap-card-title">{activeCat}</h3>
          </div>
          <button onClick={() => setShowAdd(v => !v)} className="ap-ghost-btn">
            <Ico d={D.plus} size={12} /><span>Add Item</span>
          </button>
        </div>

        {/* Add row */}
        {showAdd && (
          <div className="ap-add-row">
            <div className="ap-add-fields">
              <input placeholder="Name" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} className="ap-input ap-input--sm" />
              <input placeholder="Description" value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))} className="ap-input ap-input--sm" style={{ flex: 2 }} />
              <input placeholder="₪ Price" type="number" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))} className="ap-input ap-input--sm ap-input--price" />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={add} className="ap-ghost-btn ap-ghost-btn--gold"><span>Add</span></button>
              <button onClick={() => setShowAdd(false)} className="ap-ghost-btn"><span>Cancel</span></button>
            </div>
          </div>
        )}

        {/* Column headers */}
        <div className="ap-table-head">
          <span style={{ flex: '0 0 40%' }}>Item</span>
          <span style={{ flex: 1 }}>Description</span>
          <span style={{ flex: '0 0 64px', textAlign: 'right' }}>Price</span>
          <span style={{ width: '100px' }} />
        </div>

        <div className="ap-table-body">
          {filtered.length === 0 && <div className="ap-empty">No items in this category yet.</div>}
          {filtered.map(item => (
            <div key={item.id} className={`ap-item ${!item.active ? 'ap-item--hidden' : ''}`}>
              {editingId === item.id ? (
                <div className="ap-item-edit">
                  <input value={editData.name ?? item.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} className="ap-input ap-input--sm" style={{ flex: '0 0 30%' }} />
                  <input value={editData.description ?? item.description ?? ''} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} className="ap-input ap-input--sm" style={{ flex: 1 }} />
                  <input value={editData.price ?? item.price ?? ''} type="number" onChange={e => setEditData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className="ap-input ap-input--sm ap-input--price" />
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => saveEdit(item.id)} className="ap-icon-btn ap-icon-btn--ok"><Ico d={D.check} size={12} /></button>
                    <button onClick={() => setEditingId(null)} className="ap-icon-btn"><Ico d={D.x} size={12} /></button>
                  </div>
                </div>
              ) : (
                <div className="ap-item-row">
                  <div style={{ flex: '0 0 40%', minWidth: 0 }}>
                    <div className="ap-item-name">{item.name}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ap-item-desc">{item.description}</div>
                  </div>
                  <div className="ap-item-price">{item.price ? `₪${item.price}` : '—'}</div>
                  <div className="ap-item-actions">
                    <button onClick={() => toggleActive(item)} className="ap-pill-btn" title={item.active ? 'Hide' : 'Show'}>
                      <Ico d={item.active ? D.eye : D.eyeoff} size={12} />
                    </button>
                    <button onClick={() => { setEditingId(item.id); setEditData({}) }} className="ap-icon-btn" title="Edit">
                      <Ico d={D.edit} size={13} />
                    </button>
                    <button onClick={() => del(item.id)} className="ap-icon-btn ap-icon-btn--del" title="Delete">
                      <Ico d={D.trash} size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ReservationsTab ─────────────────────────────────────────────────────────
function ReservationsTab() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading]           = useState(true)
  const [viewMode, setViewMode]         = useState<'list'|'calendar'>('list')

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all'|'new'|'confirmed'|'cancelled'>('all')
  const [search,       setSearch]       = useState('')
  const [dateFrom,     setDateFrom]     = useState('')
  const [dateTo,       setDateTo]       = useState('')
  const [guestsMin,    setGuestsMin]    = useState('')

  // Calendar nav
  const today = new Date()
  const [calYear,  setCalYear]  = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth()) // 0-indexed

  const load = useCallback(() => {
    fetch('/admin/api/reservations').then(r => r.json()).then((d: Reservation[]) => {
      setReservations(d); setLoading(false)
    })
  }, [])
  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: string) {
    await fetch('/admin/api/reservations', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    load()
  }
  async function del(id: string) {
    if (!confirm('Delete this reservation?')) return
    await fetch('/admin/api/reservations', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  // ── Derived counts (pre-filter for stats)
  const counts = {
    all:       reservations.length,
    new:       reservations.filter(r => r.status === 'new').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }

  // ── Apply all filters
  const filtered = reservations.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (search && !r.full_name.toLowerCase().includes(search.toLowerCase()) && !r.email.toLowerCase().includes(search.toLowerCase())) return false
    if (dateFrom && r.date < dateFrom) return false
    if (dateTo   && r.date > dateTo)   return false
    if (guestsMin && r.guests < parseInt(guestsMin)) return false
    return true
  })

  // ── Sort by date ascending for grouping
  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date))

  // ── Group by date for spacers
  const grouped: { date: string; items: Reservation[] }[] = []
  sorted.forEach(r => {
    const last = grouped[grouped.length - 1]
    if (last && last.date === r.date) last.items.push(r)
    else grouped.push({ date: r.date, items: [r] })
  })

  // ── Calendar helpers
  function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
  function firstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay() } // 0=Sun
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DAY_LABELS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  // Map date string → reservations for calendar dots
  const byDate: Record<string, Reservation[]> = {}
  reservations.forEach(r => { if (!byDate[r.date]) byDate[r.date] = []; byDate[r.date].push(r) })

  function calDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  }

  const hasActiveFilters = search || dateFrom || dateTo || guestsMin || statusFilter !== 'all'

  if (loading) return <div className="ap-loading">Loading reservations…</div>

  return (
    <div className="ap-res-wrap">

      {/* ── Stat cards ── */}
      <div className="ap-stats">
        {(['all','new','confirmed','cancelled'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`ap-stat ${statusFilter === s ? 'ap-stat--active' : ''}`}>
            <span className="ap-stat-num">{counts[s]}</span>
            <span className="ap-stat-label">{s}</span>
          </button>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="ap-filter-bar">
        {/* Search */}
        <div className="ap-filter-field ap-filter-field--search">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,opacity:0.35}}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ap-filter-input"
          />
          {search && <button onClick={() => setSearch('')} className="ap-filter-clear">×</button>}
        </div>

        {/* Date from */}
        <div className="ap-filter-field">
          <label className="ap-filter-label">From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="ap-filter-input ap-filter-input--date" />
        </div>

        {/* Date to */}
        <div className="ap-filter-field">
          <label className="ap-filter-label">To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="ap-filter-input ap-filter-input--date" />
        </div>

        {/* Min guests */}
        <div className="ap-filter-field ap-filter-field--guests">
          <label className="ap-filter-label">Min guests</label>
          <input type="number" min="1" max="12" placeholder="Any" value={guestsMin} onChange={e => setGuestsMin(e.target.value)} className="ap-filter-input ap-filter-input--num" />
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); setGuestsMin(''); setStatusFilter('all') }} className="ap-filter-reset">
            Clear all
          </button>
        )}

        {/* Spacer + view toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          <button onClick={() => setViewMode('list')} className={`ap-view-btn ${viewMode === 'list' ? 'ap-view-btn--active' : ''}`} title="List view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
          <button onClick={() => setViewMode('calendar')} className={`ap-view-btn ${viewMode === 'calendar' ? 'ap-view-btn--active' : ''}`} title="Calendar view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Result count ── */}
      {hasActiveFilters && (
        <p className="ap-filter-result">
          {filtered.length} reservation{filtered.length !== 1 ? 's' : ''} match
        </p>
      )}

      {/* ════════════ LIST VIEW ════════════ */}
      {viewMode === 'list' && (
        <div className="ap-card">
          {grouped.length === 0
            ? <div className="ap-empty">No reservations match your filters.</div>
            : grouped.map(({ date, items }) => {
                const d = new Date(date + 'T00:00:00')
                const isToday = date === today.toISOString().slice(0,10)
                return (
                  <div key={date}>
                    {/* ── Date spacer ── */}
                    <div className="ap-date-spacer">
                      <div className="ap-date-spacer-rule" />
                      <div className="ap-date-spacer-label">
                        <span className="ap-date-spacer-day">
                          {d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()}
                        </span>
                        <span className="ap-date-spacer-date">
                          {d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        {isToday && <span className="ap-date-spacer-today">Today</span>}
                        <span className="ap-date-spacer-count">
                          {items.length} reservation{items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="ap-date-spacer-rule" />
                    </div>

                    {/* ── Rows for this date ── */}
                    {items.map(r => (
                      <div key={r.id} className="ap-res-row">
                        <div className="ap-res-main">
                          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'3px' }}>
                            <span className="ap-item-name">{r.full_name}</span>
                            <span className="ap-status-badge" style={{ cssText: STATUS_STYLE[r.status] } as React.CSSProperties}>
                              {r.status}
                            </span>
                          </div>
                          <span className="ap-item-desc">{r.email}</span>
                          {r.special_requests && <span className="ap-res-note">"{r.special_requests}"</span>}
                        </div>
                        <div className="ap-res-meta">
                          <span className="ap-item-name" style={{ fontSize:'13px' }}>
                            {r.guests} guest{r.guests !== 1 ? 's' : ''}
                          </span>
                          <span className="ap-item-desc" style={{ opacity: 0.45 }}>
                            Booked {new Date(r.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}
                          </span>
                        </div>
                        <div className="ap-item-actions ap-item-actions--col">
                          {r.status !== 'confirmed' && (
                            <button onClick={() => updateStatus(r.id,'confirmed')} className="ap-status-btn ap-status-btn--confirm">Confirm</button>
                          )}
                          {r.status !== 'cancelled' && (
                            <button onClick={() => updateStatus(r.id,'cancelled')} className="ap-status-btn ap-status-btn--cancel">Cancel</button>
                          )}
                          <button onClick={() => del(r.id)} className="ap-icon-btn ap-icon-btn--del">
                            <Ico d={D.trash} size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })
          }
        </div>
      )}

      {/* ════════════ CALENDAR VIEW ════════════ */}
      {viewMode === 'calendar' && (
        <div className="ap-cal-wrap">
          {/* Month nav */}
          <div className="ap-cal-nav">
            <button className="ap-cal-nav-btn" onClick={() => {
              if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
              else setCalMonth(m => m - 1)
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span className="ap-cal-month-label">
              <span style={{ fontFamily:'var(--display)', fontWeight:700, fontSize:'18px', letterSpacing:'0.05em' }}>
                {MONTH_NAMES[calMonth]}
              </span>
              <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.3)', marginLeft:'8px' }}>{calYear}</span>
            </span>
            <button className="ap-cal-nav-btn" onClick={() => {
              if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
              else setCalMonth(m => m + 1)
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Grid */}
          <div className="ap-cal-grid-wrap">
            {/* Day labels */}
            {DAY_LABELS.map(d => (
              <div key={d} className="ap-cal-day-label">{d}</div>
            ))}
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth(calYear, calMonth) }).map((_, i) => (
              <div key={`empty-${i}`} className="ap-cal-cell ap-cal-cell--empty" />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth(calYear, calMonth) }).map((_, i) => {
              const day = i + 1
              const ds = calDateStr(calYear, calMonth, day)
              const dayRes = byDate[ds] || []
              const isToday = ds === today.toISOString().slice(0,10)
              const hasNew = dayRes.some(r => r.status === 'new')
              const hasConfirmed = dayRes.some(r => r.status === 'confirmed')
              return (
                <div key={day} className={`ap-cal-cell ${isToday ? 'ap-cal-cell--today' : ''} ${dayRes.length > 0 ? 'ap-cal-cell--has-res' : ''}`}>
                  <span className="ap-cal-cell-num">{day}</span>
                  {dayRes.length > 0 && (
                    <div className="ap-cal-cell-dots">
                      {hasNew       && <span className="ap-cal-dot ap-cal-dot--new" />}
                      {hasConfirmed && <span className="ap-cal-dot ap-cal-dot--confirmed" />}
                    </div>
                  )}
                  {dayRes.length > 0 && (
                    <div className="ap-cal-cell-tooltip">
                      {dayRes.map(r => (
                        <div key={r.id} className="ap-cal-tooltip-row">
                          <span className="ap-cal-tooltip-name">{r.full_name}</span>
                          <span className="ap-cal-tooltip-guests">{r.guests}p</span>
                          <span className="ap-cal-tooltip-status" style={{ cssText: STATUS_STYLE[r.status] } as React.CSSProperties}>{r.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="ap-cal-legend">
            <div className="ap-cal-legend-item"><span className="ap-cal-dot ap-cal-dot--new" /><span>New</span></div>
            <div className="ap-cal-legend-item"><span className="ap-cal-dot ap-cal-dot--confirmed" /><span>Confirmed</span></div>
          </div>
        </div>
      )}

      <style>{`
        /* ── Filter bar ── */
        .ap-filter-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding: 14px 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .ap-filter-field {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 4px;
        }
        .ap-filter-field--search { flex: 1; min-width: 180px; }
        .ap-filter-field--guests { width: 110px; }
        .ap-filter-label {
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ap-filter-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--sans);
          font-size: 12px;
          font-weight: 300;
          color: rgba(255,255,255,0.8);
          width: 100%;
          -webkit-font-smoothing: antialiased;
        }
        .ap-filter-input::placeholder { color: rgba(255,255,255,0.2); }
        .ap-filter-input--date { width: 120px; color-scheme: dark; }
        .ap-filter-input--num  { width: 48px; }
        .ap-filter-clear {
          background: transparent; border: none;
          color: rgba(255,255,255,0.25);
          font-size: 14px; line-height: 1;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .ap-filter-clear:hover { color: rgba(255,255,255,0.6); }
        .ap-filter-reset {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          padding: 4px 10px;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .ap-filter-reset:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.65); }
        .ap-filter-result {
          font-size: 10px;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.22);
          margin-top: -4px;
          text-transform: uppercase;
        }

        /* ── View toggle ── */
        .ap-view-btn {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.3);
          transition: border-color 0.2s, color 0.2s;
        }
        .ap-view-btn:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.7); }
        .ap-view-btn--active { border-color: #F4C485; color: #F4C485; }

        /* ── Date spacer ── */
        .ap-date-spacer {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 28px 10px;
        }
        .ap-date-spacer-rule {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }
        .ap-date-spacer-label {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-shrink: 0;
        }
        .ap-date-spacer-day {
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.22);
        }
        .ap-date-spacer-date {
          font-family: var(--display);
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.55);
        }
        .ap-date-spacer-today {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #F4C485;
          border: 1px solid rgba(244,196,133,0.3);
          padding: 1px 6px;
        }
        .ap-date-spacer-count {
          font-size: 9px;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.18);
          text-transform: uppercase;
        }

        /* ── Calendar ── */
        .ap-cal-wrap {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 24px 28px 20px;
        }
        .ap-cal-nav {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .ap-cal-nav-btn {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4);
          transition: border-color 0.2s, color 0.2s;
        }
        .ap-cal-nav-btn:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); }
        .ap-cal-month-label {
          display: flex; align-items: baseline;
        }
        .ap-cal-grid-wrap {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .ap-cal-day-label {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          text-align: center;
          padding: 0 0 10px;
        }
        .ap-cal-cell {
          position: relative;
          min-height: 72px;
          padding: 8px 10px 6px;
          border: 1px solid rgba(255,255,255,0.04);
          transition: border-color 0.2s, background 0.2s;
          overflow: visible;
        }
        .ap-cal-cell:hover { background: rgba(255,255,255,0.02); }
        .ap-cal-cell--empty { background: transparent; border-color: transparent; }
        .ap-cal-cell--today { border-color: rgba(244,196,133,0.25) !important; }
        .ap-cal-cell--has-res { background: rgba(255,255,255,0.018); }
        .ap-cal-cell-num {
          display: block;
          font-family: var(--display);
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          line-height: 1;
          margin-bottom: 6px;
        }
        .ap-cal-cell--today .ap-cal-cell-num { color: #F4C485; }
        .ap-cal-cell-dots {
          display: flex; gap: 3px; flex-wrap: wrap;
        }
        .ap-cal-dot {
          display: inline-block;
          width: 5px; height: 5px; border-radius: 50%;
        }
        .ap-cal-dot--new       { background: #F4C485; }
        .ap-cal-dot--confirmed { background: rgba(120,210,150,0.8); }

        /* Tooltip on hover */
        .ap-cal-cell-tooltip {
          display: none;
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          min-width: 200px;
          background: #111;
          border: 1px solid rgba(255,255,255,0.12);
          padding: 10px 14px;
          pointer-events: none;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        }
        .ap-cal-cell:hover .ap-cal-cell-tooltip { display: block; }
        .ap-cal-tooltip-row {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ap-cal-tooltip-row:last-child { border-bottom: none; }
        .ap-cal-tooltip-name {
          flex: 1;
          font-size: 11px;
          color: rgba(255,255,255,0.8);
        }
        .ap-cal-tooltip-guests {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
        }
        .ap-cal-tooltip-status {
          font-size: 8px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 1px 5px;
          border: 1px solid;
          font-family: var(--sans);
        }

        /* Legend */
        .ap-cal-legend {
          display: flex; gap: 20px;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .ap-cal-legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }
      `}</style>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
type Tab = 'content' | 'menu' | 'reservations'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('content')
  const router = useRouter()

  async function logout() {
    await fetch('/admin/api/logout', { method: 'POST' })
    router.push('/admin/login'); router.refresh()
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'content',      label: 'Content',      icon: D.content },
    { id: 'menu',         label: 'Menu',          icon: D.menu    },
    { id: 'reservations', label: 'Reservations',  icon: D.cal     },
  ]

  return (
    <div className="ap-root">
      {/* ── Header ── */}
      <header className="ap-header">
        <div className="ap-header-inner">
          <div className="ap-header-left">
            <span className="ap-wordmark">Eclipse</span>
            <span className="ap-header-sep" />
            <nav className="ap-tabs">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`ap-tab ${tab === t.id ? 'ap-tab--active' : ''}`}>
                  <Ico d={t.icon} size={12} />
                  <span>{t.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <button onClick={logout} className="ap-logout">
            <Ico d={D.logout} size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="ap-main">
        <div className="ap-main-inner">
          {/* Page title */}
          <div className="ap-page-head">
            <div className="ap-page-head-rule" />
            <h1 className="ap-page-title">
              {tab === 'content' && 'Site Content'}
              {tab === 'menu' && 'Menu'}
              {tab === 'reservations' && 'Reservations'}
            </h1>
            <p className="ap-page-subtitle">
              {tab === 'content' && 'Edit text content for each section of the site'}
              {tab === 'menu' && 'Manage dishes and drinks by category'}
              {tab === 'reservations' && 'View and manage all booking requests'}
            </p>
          </div>

          {tab === 'content'      && <ContentTab />}
          {tab === 'menu'         && <MenuTab />}
          {tab === 'reservations' && <ReservationsTab />}
        </div>
      </main>

      <style>{`
        /* ── Root ── */
        .ap-root {
          min-height: 100svh;
          background: #000;
          color: rgba(255,255,255,0.85);
          font-family: var(--sans, 'Supreme', sans-serif);
          font-weight: 300;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Header ── */
        .ap-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(0,0,0,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ap-header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }
        .ap-header-left {
          display: flex; align-items: center; gap: 28px;
          min-width: 0;
        }
        .ap-wordmark {
          font-family: var(--display);
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.9);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ap-header-sep {
          width: 1px; height: 18px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        /* ── Nav tabs ── */
        .ap-tabs {
          display: flex; align-items: center; gap: 2px;
        }
        .ap-tab {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 14px;
          background: transparent;
          border: none;
          font-family: var(--sans);
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          border-bottom: 1px solid transparent;
          transition: color 0.25s, border-color 0.25s;
          white-space: nowrap;
        }
        .ap-tab:hover { color: rgba(255,255,255,0.65); }
        .ap-tab--active {
          color: rgba(255,255,255,0.9);
          border-bottom-color: #F4C485;
        }

        /* ── Logout ── */
        .ap-logout {
          display: flex; align-items: center; gap: 7px;
          background: transparent; border: none;
          font-family: var(--sans);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
          transition: color 0.25s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ap-logout:hover { color: rgba(255,255,255,0.55); }

        /* ── Main ── */
        .ap-main {
          padding: 48px 40px 80px;
        }
        .ap-main-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ── Page header ── */
        .ap-page-head {
          margin-bottom: 36px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .ap-page-head-rule {
          width: 28px; height: 1px;
          background: #F4C485;
          margin-bottom: 4px;
          opacity: 0.6;
        }
        .ap-page-title {
          font-family: var(--display);
          font-weight: 700;
          font-size: 28px;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.02em;
          line-height: 1.1;
        }
        .ap-page-subtitle {
          font-size: 12px;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.25);
        }

        /* ── Card ── */
        .ap-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .ap-card-head {
          padding: 20px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; gap: 14px;
        }
        .ap-card-head--row {
          justify-content: space-between;
        }
        .ap-card-num {
          font-family: var(--sans);
          font-size: 10px;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.2);
        }
        .ap-card-title {
          font-family: var(--display);
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          line-height: 1;
        }
        .ap-card-body {
          padding: 24px 28px;
          display: flex; flex-direction: column; gap: 24px;
        }

        /* ── Content grid ── */
        .ap-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* ── Field row ── */
        .ap-field-row {
          display: flex; flex-direction: column; gap: 8px;
        }
        .ap-field-row-head {
          display: flex; align-items: center; justify-content: space-between;
        }

        /* ── Label ── */
        .ap-label {
          font-family: var(--sans);
          font-size: 9px;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          display: block;
        }

        /* ── Input ── */
        .ap-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding: 10px 0;
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.85);
          outline: none;
          transition: border-color 0.25s;
          -webkit-font-smoothing: antialiased;
        }
        .ap-input::placeholder { color: rgba(255,255,255,0.18); }
        .ap-input:focus { border-color: rgba(255,255,255,0.35); }
        .ap-textarea {
          resize: none;
          line-height: 1.7;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .ap-input--sm { padding: 7px 0; font-size: 12px; }
        .ap-input--price { flex: 0 0 72px !important; text-align: right; }

        /* ── Save button ── */
        .ap-save-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.14);
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          transition: border-color 0.25s, color 0.25s;
        }
        .ap-save-btn:hover { border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.85); }
        .ap-save-btn--saved {
          border-color: rgba(244,196,133,0.3) !important;
          color: #F4C485 !important;
        }

        /* ── Ghost button ── */
        .ap-ghost-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 16px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.14);
          font-family: var(--sans);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          transition: border-color 0.25s, color 0.25s;
        }
        .ap-ghost-btn:hover { border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.85); }
        .ap-ghost-btn--gold { border-color: rgba(244,196,133,0.3); color: #F4C485; }
        .ap-ghost-btn--gold:hover { border-color: #F4C485; color: #F4C485; }

        /* ── Menu layout ── */
        .ap-menu-wrap { display: flex; flex-direction: column; gap: 20px; }
        .ap-cats {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .ap-cat {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 14px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          font-family: var(--sans);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          transition: border-color 0.25s, color 0.25s;
        }
        .ap-cat:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.65); }
        .ap-cat--active { border-color: #F4C485; color: rgba(255,255,255,0.9); }
        .ap-cat--active:hover { border-color: #F4C485; }
        .ap-cat-count {
          font-size: 9px;
          color: rgba(255,255,255,0.22);
        }

        /* ── Add row ── */
        .ap-add-row {
          padding: 16px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.015);
          display: flex; flex-direction: column; gap: 12px;
        }
        .ap-add-fields { display: flex; gap: 16px; align-items: flex-end; }

        /* ── Table ── */
        .ap-table-head {
          display: flex; align-items: center; gap: 20px;
          padding: 10px 28px;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ap-table-body { display: flex; flex-direction: column; }

        .ap-item {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
        }
        .ap-item:last-child { border-bottom: none; }
        .ap-item:hover { background: rgba(255,255,255,0.018); }
        .ap-item--hidden { opacity: 0.3; }

        .ap-item-row {
          display: flex; align-items: center; gap: 20px;
          padding: 14px 28px;
        }
        .ap-item-edit {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 28px;
        }

        .ap-item-name {
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.85);
        }
        .ap-item-desc {
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.28);
          font-style: italic;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ap-item-price {
          flex: 0 0 64px;
          text-align: right;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }
        .ap-item-actions {
          display: flex; align-items: center; gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
          width: 100px;
          justify-content: flex-end;
          flex-shrink: 0;
        }
        .ap-item-actions--col { flex-direction: column; align-items: flex-end; opacity: 1; gap: 4px; }
        .ap-item:hover .ap-item-actions { opacity: 1; }
        .ap-res-row:hover .ap-item-actions { opacity: 1; }

        .ap-icon-btn {
          padding: 5px;
          background: transparent; border: none;
          color: rgba(255,255,255,0.25);
          transition: color 0.2s;
          display: flex; align-items: center;
        }
        .ap-icon-btn:hover { color: rgba(255,255,255,0.7); }
        .ap-icon-btn--ok { color: rgba(244,196,133,0.5); }
        .ap-icon-btn--ok:hover { color: #F4C485; }
        .ap-icon-btn--del:hover { color: rgba(220,80,80,0.7); }

        .ap-pill-btn {
          padding: 4px 6px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          transition: border-color 0.2s, color 0.2s;
          display: flex; align-items: center;
        }
        .ap-pill-btn:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.7); }

        /* ── Reservations ── */
        .ap-res-wrap { display: flex; flex-direction: column; gap: 20px; }
        .ap-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
        }
        .ap-stat {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 20px 24px;
          text-align: left;
          display: flex; flex-direction: column; gap: 6px;
          transition: border-color 0.25s;
        }
        .ap-stat:hover { border-color: rgba(255,255,255,0.14); }
        .ap-stat--active { border-color: rgba(244,196,133,0.3); }
        .ap-stat-num {
          font-family: var(--display);
          font-size: 32px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          line-height: 1;
        }
        .ap-stat-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }

        .ap-res-row {
          display: flex; align-items: flex-start; gap: 24px;
          padding: 18px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
        }
        .ap-res-row:last-child { border-bottom: none; }
        .ap-res-row:hover { background: rgba(255,255,255,0.018); }
        .ap-res-main { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .ap-res-meta { flex: 0 0 140px; display: flex; flex-direction: column; gap: 3px; text-align: right; }
        .ap-res-note {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          font-style: italic;
          margin-top: 2px;
        }

        .ap-status-badge {
          display: inline-flex; align-items: center;
          padding: 2px 8px;
          border: 1px solid;
          border-radius: 0;
          font-size: 8px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-family: var(--sans);
          font-weight: 300;
        }

        .ap-status-btn {
          padding: 4px 10px;
          background: transparent;
          font-family: var(--sans);
          font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
          border: 1px solid;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .ap-status-btn--confirm {
          color: rgba(180,240,200,0.7);
          border-color: rgba(120,200,140,0.2);
        }
        .ap-status-btn--confirm:hover {
          background: rgba(80,180,100,0.08);
        }
        .ap-status-btn--cancel {
          color: rgba(220,130,130,0.6);
          border-color: rgba(200,80,80,0.15);
        }
        .ap-status-btn--cancel:hover {
          background: rgba(180,60,60,0.08);
        }

        /* ── Misc ── */
        .ap-loading {
          padding: 60px 0;
          text-align: center;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }
        .ap-empty {
          padding: 40px 28px;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.18);
        }
      `}</style>
    </div>
  )
}
