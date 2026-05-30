'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BookingDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function BookingDrawer({ open, onClose }: BookingDrawerProps) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    date: '',
    guests: '',
    special_requests: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.date || !form.guests) return;
    setStatus('loading');

    const { error } = await supabase.from('reservations').insert({
      full_name: form.full_name,
      email: form.email,
      date: form.date,
      guests: parseInt(form.guests),
      special_requests: form.special_requests || null,
    });

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ full_name: '', email: '', date: '', guests: '', special_requests: '' });
    }
  }

  function handleClose() {
    setStatus('idle');
    onClose();
  }

  return (
    <>
      <div id="doverlay" className={open ? 'open' : ''} onClick={handleClose} />
      <div id="drawer" className={open ? 'open' : ''}>
        <div className="dr-handle-wrap" onClick={handleClose}>
          <div className="dr-handle" />
          <button className="dr-close" onClick={handleClose}>✕&nbsp;&nbsp;Close</button>
        </div>
        <div className="dr-header">
          <div className="dr-title">Reserve Your Seat</div>
        </div>

        {status === 'success' ? (
          <div className="dr-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', paddingTop: '3rem' }}>
            <div style={{ fontSize: '2.5rem' }}>✦</div>
            <div style={{ fontSize: '1.1rem', letterSpacing: '0.1em', color: 'var(--color-cream, #f5f0e8)' }}>Reservation Received</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted, #888)', textAlign: 'center', lineHeight: 1.6 }}>
              We'll be in touch shortly to confirm your table.
            </div>
            <button className="dr-submit" style={{ marginTop: '1rem' }} onClick={handleClose}>Close</button>
          </div>
        ) : (
          <form className="dr-form" onSubmit={handleSubmit}>
            <div className="dr-field">
              <div className="dr-label">Full Name</div>
              <input className="dr-input" type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Your name" required />
            </div>
            <div className="dr-field">
              <div className="dr-label">Email</div>
              <input className="dr-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
            </div>
            <div className="dr-field">
              <div className="dr-label">Date</div>
              <input className="dr-input" type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="dr-field">
              <div className="dr-label">Guests</div>
              <input className="dr-input" type="number" name="guests" value={form.guests} onChange={handleChange} placeholder="2" min={1} max={12} required />
            </div>
            <div className="dr-field full">
              <div className="dr-label">Special Requests</div>
              <input className="dr-input" type="text" name="special_requests" value={form.special_requests} onChange={handleChange} placeholder="Allergies, occasions, preferences…" />
            </div>
            {status === 'error' && (
              <div style={{ color: '#f87171', fontSize: '0.8rem', textAlign: 'center' }}>
                Something went wrong. Please try again.
              </div>
            )}
            <div className="dr-submit-wrap">
              <button className="dr-submit" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Confirm Reservation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
