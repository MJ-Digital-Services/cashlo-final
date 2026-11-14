"use client";

import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { usePauseSmoothScroll } from "./Dialog";

/*
 * Side sheet (slides in from the right; swipe right to dismiss), built on
 * Base UI's Drawer primitive — a Dialog with gesture support — so it gets
 * the same focus trap, Escape / outside-tap dismissal, focus return and
 * scroll lock as `Dialog`, plus the same Lenis handling (see Dialog.tsx:
 * Lenis is stopped while open, and the popup is `data-lenis-prevent` so its
 * own content scrolls natively).
 */

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  usePauseSmoothScroll(open);

  return (
    <Drawer.Root open={open} onOpenChange={(next) => onOpenChange(next)} swipeDirection="right">
      {children}
    </Drawer.Root>
  );
}

export function SheetContent({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Drawer.Portal>
      <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/40 opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[swiping]:duration-0" />
      <Drawer.Viewport className="fixed inset-0 z-50 flex justify-end">
        <Drawer.Popup
          data-lenis-prevent
          // follows the finger while swiping (--drawer-swipe-movement-x),
          // slides fully off-screen on open/close
          className={`h-full w-[82%] max-w-sm overscroll-contain bg-card shadow-2xl outline-none [transform:translateX(var(--drawer-swipe-movement-x))] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-[ending-style]:[transform:translateX(100%)] data-[starting-style]:[transform:translateX(100%)] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*300ms)] data-[swiping]:select-none ${className}`}
        >
          {children}
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  );
}

export const SheetTitle = Drawer.Title;
export const SheetClose = Drawer.Close;
