"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { distributorApi, ApiError } from "@/lib/api/distributor";

// Shared KYC form: PAN, Aadhaar address, shop details, Aadhaar front/back
// upload (with click-to-preview lightbox) and optional referral code. Used by
// both KYC points in the distributor flow — the full plan before its single
// ₹6,490 payment (ReserveCheckout) and the booking plan's ₹5,900 final
// payment (CompletePaymentFlow). Fully controlled: the parent owns `values`
// (so it can persist them to sessionStorage); upload state lives here.

export type KycValues = {
  panCard: string;
  aadhaarAddress: string;
  shopName: string;
  shopAddress: string;
  referralCode: string;
  aadhaarFrontUrl: string;
  aadhaarBackUrl: string;
};

export const EMPTY_KYC: KycValues = {
  panCard: "",
  aadhaarAddress: "",
  shopName: "",
  shopAddress: "",
  referralCode: "",
  aadhaarFrontUrl: "",
  aadhaarBackUrl: "",
};

// Must match the backend's uploadImage multer limit (src/middlewares/upload.js)
const MAX_AADHAAR_IMAGE_BYTES = 5 * 1024 * 1024;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// Mirrors the backend's validateKyc + Aadhaar check. Returns an error message,
// or null when the details are complete.
export function kycError(v: KycValues): string | null {
  if (!v.panCard.trim() || !v.aadhaarAddress.trim() || !v.shopName.trim() || !v.shopAddress.trim()) {
    return "Please fill in all fields to continue.";
  }
  if (!PAN_REGEX.test(v.panCard.trim())) {
    return "Please enter a valid PAN card number (e.g. ABCDE1234F).";
  }
  if (!v.aadhaarFrontUrl || !v.aadhaarBackUrl) {
    return "Please upload both the front and back images of your Aadhaar card.";
  }
  return null;
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-ink/35 focus:border-brand focus:ring-[3px] focus:ring-brand/15";
const labelClass = "mt-3 block text-[13px] font-medium text-ink/70";

export function DistributorKycFields({
  bookingId,
  values,
  onChange,
  showReferral = true,
}: {
  bookingId: string;
  values: KycValues;
  onChange: (next: KycValues) => void;
  // The reserve checkout already asks for a referral code on its details
  // form, so it hides this one to avoid asking twice.
  showReferral?: boolean;
}) {
  const [uploading, setUploading] = useState<{ front: boolean; back: boolean }>({ front: false, back: false });
  const [uploadError, setUploadError] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const set = (key: keyof KycValues, value: string) => onChange({ ...values, [key]: value });

  async function handleAadhaarUpload(side: "front" | "back", file: File | null) {
    if (!file || !bookingId) return;
    setUploadError("");
    if (file.size > MAX_AADHAAR_IMAGE_BYTES) {
      setUploadError(
        `Aadhaar ${side} image is too large (max ${MAX_AADHAAR_IMAGE_BYTES / (1024 * 1024)}MB). Please choose a smaller file.`
      );
      return;
    }
    setUploading((u) => ({ ...u, [side]: true }));
    try {
      const result = await distributorApi.uploadAadhaarImage(bookingId, side, file);
      onChange({ ...values, [side === "front" ? "aadhaarFrontUrl" : "aadhaarBackUrl"]: result.url });
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : `Failed to upload Aadhaar ${side} image.`);
    } finally {
      setUploading((u) => ({ ...u, [side]: false }));
    }
  }

  return (
    <>
      <label className={labelClass}>PAN Card Number</label>
      <input
        required
        value={values.panCard}
        onChange={(e) => set("panCard", e.target.value.toUpperCase().slice(0, 10))}
        placeholder="e.g. ABCDE1234F"
        className={inputClass + " font-mono tracking-wide uppercase"}
      />

      <label className={labelClass}>Aadhaar Address</label>
      <textarea
        required
        value={values.aadhaarAddress}
        onChange={(e) => set("aadhaarAddress", e.target.value)}
        rows={2}
        placeholder="Address as per Aadhaar card"
        className={inputClass + " resize-none"}
      />

      <label className={labelClass}>Shop Name</label>
      <input
        required
        value={values.shopName}
        onChange={(e) => set("shopName", e.target.value)}
        placeholder="e.g. Sharma General Store"
        className={inputClass}
      />

      <label className={labelClass}>Shop Address</label>
      <textarea
        required
        value={values.shopAddress}
        onChange={(e) => set("shopAddress", e.target.value)}
        rows={2}
        placeholder="Full shop address"
        className={inputClass + " resize-none"}
      />

      <label className={labelClass}>Aadhaar Card Images</label>
      <div className="mt-1.5 grid grid-cols-2 gap-3">
        {(["front", "back"] as const).map((side) => {
          const url = side === "front" ? values.aadhaarFrontUrl : values.aadhaarBackUrl;
          return (
            <div key={side}>
              <input
                id={`aadhaar-${side}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAadhaarUpload(side, e.target.files?.[0] ?? null)}
              />
              {url ? (
                <button
                  type="button"
                  onClick={() => setPreviewImageUrl(url)}
                  className="group relative block aspect-[16/10] w-full overflow-hidden rounded-lg border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Aadhaar ${side}`}
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                  />
                  <label
                    htmlFor={`aadhaar-${side}`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-1.5 right-1.5 rounded-md bg-black/60 px-2 py-1 text-[10.5px] font-medium text-white backdrop-blur-sm hover:bg-black/75"
                  >
                    Replace
                  </label>
                </button>
              ) : (
                <label
                  htmlFor={`aadhaar-${side}`}
                  className="flex aspect-[16/10] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-surface/60 text-ink/45 transition-colors hover:border-brand/40 hover:text-ink/65"
                >
                  {uploading[side] ? (
                    <span className="text-[12px]">Uploading…</span>
                  ) : (
                    <>
                      <Upload size={16} strokeWidth={2} />
                      <span className="text-[12px] font-medium capitalize">{side} side</span>
                    </>
                  )}
                </label>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {uploadError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2.5 text-[13px] text-red-600"
          >
            {uploadError}
          </motion.p>
        )}
      </AnimatePresence>

      {showReferral && (
        <>
          <label className={labelClass}>
            Referral Code <span className="font-normal text-ink/35">(optional)</span>
          </label>
          <input
            value={values.referralCode}
            onChange={(e) => set("referralCode", e.target.value)}
            placeholder="If someone referred you"
            className={inputClass}
          />
        </>
      )}

      <AnimatePresence>
        {previewImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setPreviewImageUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[85vh] max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImageUrl}
                alt="Aadhaar preview"
                className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
