'use client';

interface BookingDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function BookingDrawer({ open, onClose }: BookingDrawerProps) {
  return (
    <>
      <div id="doverlay" className={open ? 'open' : ''} onClick={onClose} />
      <div id="drawer" className={open ? 'open' : ''}>
        <div className="dr-handle-wrap" onClick={onClose}>
          <div className="dr-handle" />
        </div>
        <div className="dr-header">
          <div className="dr-title">Reserve Your Seat</div>
          <button className="dr-close" onClick={onClose}>✕ Close</button>
        </div>
        <form className="dr-form" onSubmit={e => e.preventDefault()}>
          <div className="dr-field">
            <div className="dr-label">Full Name</div>
            <input className="dr-input" type="text" placeholder="Your name" />
          </div>
          <div className="dr-field">
            <div className="dr-label">Email</div>
            <input className="dr-input" type="email" placeholder="you@email.com" />
          </div>
          <div className="dr-field">
            <div className="dr-label">Date</div>
            <input className="dr-input" type="date" />
          </div>
          <div className="dr-field">
            <div className="dr-label">Guests</div>
            <input className="dr-input" type="number" placeholder="2" min={1} max={12} />
          </div>
          <div className="dr-field full">
            <div className="dr-label">Special Requests</div>
            <input className="dr-input" type="text" placeholder="Allergies, occasions, preferences…" />
          </div>
          <div className="dr-submit-wrap">
            <button className="dr-submit">Confirm Reservation</button>
          </div>
        </form>
      </div>
    </>
  );
}
