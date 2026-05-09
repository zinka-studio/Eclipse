'use client';
import { useState } from 'react';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Nav from '@/components/ui/Nav';
import BookingDrawer from '@/components/ui/BookingDrawer';
import Hero from '@/components/sections/Hero';
import Concept from '@/components/sections/Concept';
import Elixir from '@/components/sections/Elixir';
import SecretCreation from '@/components/sections/SecretCreation';
import Food from '@/components/sections/Food';
import EclipseFooter from '@/components/sections/EclipseFooter';

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Nav onReserve={openDrawer} />
      <Hero onReserve={openDrawer} />
      <Concept />
      <Elixir onReserve={openDrawer} />
      <SecretCreation />
      <Food />
      <EclipseFooter onReserve={openDrawer} />
      <BookingDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
