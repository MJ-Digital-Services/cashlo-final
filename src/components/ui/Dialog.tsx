"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { useLenis } from "lenis/react";

/*
 * Shared modal dialog, built on Base UI's Dialog primitive (focus trap,
 * Escape / outside-click dismissal, focus return, aria wiring, and a
 * document scroll lock). Use this for every overlay — don't hand-roll
 * `fixed inset-0` overlays again.
 *
 * Why the extra Lenis handling: the site scrolls through Lenis
 * (SmoothScroll.tsx), which moves the page with window.scrollTo on every
 * wheel/touchpad event. `overflow: hidden` — what Base UI's scroll lock and
 * the old hand-rolled modals set — doesn't stop programmatic scrolling, so
 * the page kept scrolling behind an open dialog, and wheeling over the
 * dialog's own content scrolled the page instead of the dialog. So while a
 * dialog is open we stop Lenis (it then swallows wheel events), and the
 * popup is marked `data-lenis-prevent` so Lenis lets wheel/touch inside
 * the dialog through to native scrolling of the dialog's own content
 * (give scrollable popups `overscroll-contain` so it doesn't chain out).
 */

// How many dialogs currently hold Lenis stopped. Counted so that one dialog
// closing while another opens (e.g. the lead form handing over to its
// success dialog) doesn't restart scrolling behind the one still open.
let pauseCount = 0;

/** Stops Lenis while `open` (see the note above). Shared with Sheet. */
export function usePauseSmoothScroll(open: boolean) {
  const lenis = useLenis();

  React.useEffect(() => {
    if (!open || !lenis) return;
    pauseCount += 1;
    lenis.stop();
    return () => {
      pauseCount -= 1;
      if (pauseCount === 0) lenis.start();
    };
  }, [open, lenis]);
}

export function Dialog({
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
    <BaseDialog.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      {children}
    </BaseDialog.Root>
  );
}

/**
 * Portal + backdrop + viewport + popup in one. Animate with Base UI's
 * `data-[starting-style]` / `data-[ending-style]` attributes on `className`
 * (popup) and `backdropClassName` — they're present on the first/last
 * frame, so a CSS transition on those properties runs on open/close.
 */
export function DialogContent({
  className,
  backdropClassName,
  viewportClassName,
  children,
  ...popupProps
}: Omit<React.ComponentProps<typeof BaseDialog.Popup>, "className"> & {
  className?: string;
  backdropClassName?: string;
  viewportClassName?: string;
}) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className={
          backdropClassName ??
          "fixed inset-0 z-[100] bg-[#0B1020]/55 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
        }
      />
      <BaseDialog.Viewport
        className={viewportClassName ?? "fixed inset-0 z-[100] flex items-center justify-center p-4"}
      >
        {/* data-lenis-prevent on the popup only (not the full-screen
            viewport): wheel/touch anywhere outside the popup is swallowed
            by the stopped Lenis, so the page can't move even before Base
            UI's own scroll lock has been applied. */}
        <BaseDialog.Popup data-lenis-prevent className={className} {...popupProps}>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

export const DialogTitle = BaseDialog.Title;
export const DialogDescription = BaseDialog.Description;
export const DialogClose = BaseDialog.Close;
