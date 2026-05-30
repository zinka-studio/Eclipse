// Admin layout — inherits root html/body (fonts, film grain)
// Overrides: cursor to auto, hides site-specific UI
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Admin overrides */
        .admin-root { cursor: auto !important; }
        .admin-root * { cursor: auto !important; }
        #cursor-dot, #cursor-ring, #spb { display: none !important; }
      `}</style>
      <div className="admin-root">
        {children}
      </div>
    </>
  )
}
