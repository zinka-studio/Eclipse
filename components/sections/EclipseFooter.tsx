'use client';
import { useRef } from 'react';
import { useFooterFrameSequence } from '@/hooks/useFooterFrameSequence';

const SECTION_HEIGHT = 140; // vh — scroll space for the video sequence

interface FooterProps { onReserve: () => void; }

export default function EclipseFooter({ onReserve }: FooterProps) {
  const sectionRef  = useRef<HTMLElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const blackRef    = useRef<HTMLDivElement>(null);
  const blurRef     = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);

  useFooterFrameSequence(canvasRef, sectionRef, panelRef, blackRef, blurRef, contentRef);

  return (
    <section id="footer" ref={sectionRef} style={{ height: `${SECTION_HEIGHT}vh` }}>
      <div ref={panelRef} className="footer-sticky">

        {/* Frame canvas */}
        <canvas ref={canvasRef} className="footer-canvas" />

        {/* Fades from solid black → transparent as video reveals */}
        <div ref={blackRef} className="footer-black" />

        {/* Blurred dim layer that appears at the end, sits under text */}
        <div ref={blurRef} className="footer-blur" />

        {/* Footer text content — reveals as video approaches its last frame */}
        <div ref={contentRef} className="footer-content">
          <div className="ft-pre">Fine Cocktail Bar · Tel Aviv · Est. 2024</div>
          <div className="ft-wordmark">Eclipse</div>
          <div className="ft-info">
            <div className="ft-info-item">
              <div className="ft-info-label">Address</div>
              <div className="ft-info-val">42 HaNevi&apos;im St.</div>
            </div>
            <div className="ft-sep-v" />
            <div className="ft-info-item">
              <div className="ft-info-label">Hours</div>
              <div className="ft-info-val">20:00 — Last shadow</div>
            </div>
            <div className="ft-sep-v" />
            <div className="ft-info-item">
              <div className="ft-info-label">Reservations</div>
              <div className="ft-info-val">Required</div>
            </div>
          </div>
          <div className="ft-cta">
            <button className="btn btn-ghost" onClick={onReserve} style={{ cursor: 'none' }}>
              Reserve Your Seat
            </button>
          </div>
          <div className="ft-bottom">
            <div className="ft-bottom-legal">
              <a href="#" className="ft-legal-link" style={{ cursor: 'none' }}>Accessibility</a>
              <a href="#" className="ft-legal-link" style={{ cursor: 'none' }}>Privacy Policy</a>
            </div>
            <div className="ft-copy">© 2026 Eclipse Bar Ltd. · Tel Aviv · All rights reserved</div>
            <div className="ft-credit">
              <a
                href="https://www.zinkadesigns.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="zinka-link"
                style={{ cursor: 'none' }}
              >
                <img
                  src="/media/LOGO.svg"
                  alt="Designed & crafted by Zinka"
                  width={164}
                  height={26}
                  className="ft-credit-logo"
                />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
