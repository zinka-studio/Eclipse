'use client';
import { useRef } from 'react';
import { motion, useInView, Variants } from 'motion/react';

const GLASS_IMAGE = 'https://www.figma.com/api/mcp/asset/44034922-06b8-4d66-af89-674b44fab662';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const statusVariants: Variants = {
  hidden: { opacity: 0, letterSpacing: '1em' },
  visible: {
    opacity: 1,
    letterSpacing: '0.22em',
    transition: {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.8,
    },
  },
};

export default function SecretCreation() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  return (
    <section id="secret-creation" ref={sectionRef}>
      {/* Background with heartbeat */}
      <div className="sc-bg" aria-hidden="true">
        <div className="sc-bg-dark" />
        <div className="sc-img-wrap">
          <div className="sc-heartbeat-wrap">
            <motion.img
              className="sc-img"
              src={GLASS_IMAGE}
              alt=""
              initial={{ opacity: 0, scale: 1.1 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
        {/* Radial vignette to blend edges */}
        <div className="sc-vignette" />
      </div>

      {/* Content */}
      <motion.div
        className="sc-content"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.h2 className="sc-title">
          <motion.span className="sc-title-line" variants={itemVariants}>
            Tonight&apos;s
          </motion.span>
          <motion.span className="sc-title-line" variants={itemVariants}>
            Secret Creation.
          </motion.span>
        </motion.h2>

        <motion.p className="sc-body" variants={itemVariants}>
          Every evening our master alchemist debuts a single creation that exists for one night
          only. No recipe is ever repeated. Ask your server for the &ldquo;Eclipse Protocol&rdquo;
          to reveal tonight&apos;s secret.
        </motion.p>

        <motion.div className="sc-status" variants={statusVariants}>
          UNLOCKED AT SUNSET
        </motion.div>
      </motion.div>
    </section>
  );
}
