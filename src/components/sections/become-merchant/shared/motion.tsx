'use client';

import * as React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { EASE } from './tokens';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li' | 'article';
};

/** Scroll-reveal wrapper that quietly disables itself for reduced-motion users. */
export function Reveal({ children, delay = 0, y = 24, className, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Staggered list container — pair with <StaggerItem>. */
export function StaggerGroup({
  children,
  className,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? undefined : stagger}
      initial={reduce ? undefined : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={reduce ? undefined : fadeUp} className={className}>
      {children}
    </motion.div>
  );
}