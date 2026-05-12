'use client';
import { useState, useRef } from 'react';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Nav from '@/components/ui/Nav';
import BookingDrawer from '@/components/ui/BookingDrawer';
import Preloader from '@/components/ui/Preloader';
import Hero from '@/components/sections/Hero';
import Concept from '@/components/sections/Concept';
import Elixir from '@/components/sections/Elixir';
import SecretCreation from '@/components/sections/SecretCreation';
import Food from '@/components/sections/Food';
import Menu from '@/components/sections/Menu';
import EclipseFooter from '@/components/sections/EclipseFooter';
import { getLenis, stopLenis, startLenis } from '@/lib/lenis';

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const savedScroll = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleMenuToggle = (open: boolean, scrollTarget?: string) => {
    clearTimeout(closeTimer.current);
    const shell = document.getElementById('page-shell');
    if (!shell) return;

    if (open) {
      const scrollY = window.scrollY;
      savedScroll.current = scrollY;

      // Apply constraints via inline style BEFORE adding the class so
      // scrollTop takes effect before the CSS transition fires.
      shell.style.height = '100vh';
      shell.style.overflow = 'hidden';
      void shell.offsetHeight;              // force reflow so shell is a scroll container
      shell.scrollTop = scrollY;            // show the section the user was on
      shell.style.setProperty('--scroll-y', `${scrollY}px`);

      stopLenis();
      document.documentElement.style.overflow = 'hidden';
      setMenuOpen(true);
    } else {
      setMenuOpen(false);
      // Keep constraints alive during the 0.65s zoom-in animation,
      // then restore everything. If a nav link was clicked, scroll there;
      // otherwise jump back to where the user was before opening the menu.
      closeTimer.current = setTimeout(() => {
        shell.style.height = '';
        shell.style.overflow = '';
        shell.scrollTop = 0;
        document.documentElement.style.overflow = '';
        window.scrollTo(0, savedScroll.current);
        startLenis();
        if (scrollTarget) {
          const el = document.querySelector(scrollTarget) as HTMLElement | null;
          if (el) {
            const targetY = savedScroll.current + el.getBoundingClientRect().top;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
            // Sync Lenis internal state to final position after scroll completes
            setTimeout(() => {
              getLenis()?.scrollTo(window.scrollY, { immediate: true });
            }, 1400);
          }
        }
      }, 680);
    }
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <Preloader onComplete={() => setHeroReady(true)} />
      <CustomCursor />
      <ScrollProgress />
      <Nav onReserve={openDrawer} menuOpen={menuOpen} onMenuToggle={handleMenuToggle} />
      <div id="page-shell" className={menuOpen ? 'menu-open' : ''}>
        <Hero onReserve={openDrawer} ready={heroReady} hideLb />
        <Concept />
        <Elixir onReserve={openDrawer} />
        <SecretCreation />
        <Food />
        <Menu />
        <EclipseFooter onReserve={openDrawer} />
      </div>
      <BookingDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
