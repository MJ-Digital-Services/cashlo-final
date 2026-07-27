'use client';

import * as React from 'react';
import { useAnimatedNumber, useSeen } from './hooks';

/** Counts up the first time it scrolls into view. */
export function CountUp({
  to,
  format = (n: number) => Math.round(n).toLocaleString('en-IN'),
  className,
}: {
  to: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref);
  const value = useAnimatedNumber(seen ? to : 0, 1100);
  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}