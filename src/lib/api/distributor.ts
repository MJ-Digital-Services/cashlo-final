const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api/v1";

export type PincodeCheckResult = {
  pincode: string;
  district: string;
  state: string;
  alternateDistricts: string[];
  alternateStates: string[];
  officeNames: string[];
  available: boolean;
  reason: "already_allotted" | "temporarily_reserved" | null;
};

export type Consents = {
  nonRefundable: boolean;
  terms: boolean;
  kyc: boolean;
  genuineMerchants: boolean;
  policyViolation: boolean;
};

export type DistributorFormInput = {
  name: string;
  mobile: string;
  email: string;
  pincode: string;
  asmCode?: string;
  referralCode?: string;
  consents: Consents;
};

// Mirrors cashlo-backend's publicPlans() (src/config/distributorFees.js),
// returned by verifyOtp. All amounts are paise, inclusive of GST.
export type DistributorPlan = "booking" | "full";

export type PlanPricing = {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number; // what's paid now for this plan
  total: number; // total distributor fee on this plan
  finalAmount?: number; // booking plan only: the later ₹5,900
};

export type DistributorPlans = Record<DistributorPlan, PlanPricing>;

// Shown before OTP verification, when the live plans from verifyOtp aren't
// loaded yet (and for sessions restored from before they were). Must match
// the backend's DISTRIBUTOR_PLANS — the backend's values win once loaded,
// and are what's actually charged.
export const DEFAULT_PLANS: DistributorPlans = {
  booking: { baseAmount: 100000, gstAmount: 18000, totalAmount: 118000, total: 708000, finalAmount: 590000 },
  full: { baseAmount: 550000, gstAmount: 99000, totalAmount: 649000, total: 649000 },
};

export function formatRupees(paise: number, decimals = false) {
  return `₹${(paise / 100).toLocaleString("en-IN", decimals ? { minimumFractionDigits: 2 } : undefined)}`;
}

export type FullPlanKyc = {
  panCard: string;
  aadhaarAddress: string;
  shopName: string;
  shopAddress: string;
  referralCode?: string;
};

export type NearbyPincodeSuggestion = {
  pincode: string;
  district: string;
  state: string;
};

export type ExistingBookingLookup = {
  bookingId: string;
  pincode: string;
  name: string;
  maskedMobile: string;
  maskedEmail: string;
  status: "paid" | "activated";
};

export type ExistingBookingSummary = {
  bookingId: string;
  pincode: string;
  name: string;
  mobile: string;
  email: string;
  bookingDate: string;
  status: string;
  totalFee: number;
  amountPaid: number;
  pendingAmount: number;
};

export type AadhaarUploadResult = {
  bookingId: string;
  side: "front" | "back";
  url: string;
};

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new ApiError(json?.message || "Something went wrong. Please try again.", res.status);
  }

  return json.data as T;
}

async function postFormData<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new ApiError(json?.message || "Something went wrong. Please try again.", res.status);
  }

  return json.data as T;
}


export const distributorApi = {
  checkPincode: (pincode: string) =>
    post<PincodeCheckResult>("/distributor/check-pincode", { pincode }),

  getNearbyPincodes: (pincode: string) =>
    post<NearbyPincodeSuggestion[]>("/distributor/nearby-pincodes", { pincode }),

  sendOtp: (input: DistributorFormInput) =>
    post<{ bookingId: string }>("/distributor/send-otp", input),

  verifyOtp: (bookingId: string, otp: string) =>
    post<{ bookingId: string; plans: DistributorPlans }>("/distributor/verify-otp", { bookingId, otp }),

  // kyc is required (and only sent) for the full plan.
  submitUtr: (bookingId: string, utr: string, plan: DistributorPlan, kyc?: FullPlanKyc) =>
    post<{ bookingId: string; plan: DistributorPlan; status: string }>("/distributor/submit-utr", {
      bookingId,
      utr,
      plan,
      ...(plan === "full" ? kyc : {}),
    }),

  findExistingBooking: (pincode: string) =>
    post<ExistingBookingLookup>("/distributor/find-existing-booking", { pincode }),

  sendExistingBookingOtp: (bookingId: string) =>
    post<{ bookingId: string }>("/distributor/existing-booking/send-otp", { bookingId }),

  verifyExistingBookingOtp: (bookingId: string, otp: string) =>
    post<ExistingBookingSummary>("/distributor/existing-booking/verify-otp", { bookingId, otp }),

  uploadAadhaarImage: (bookingId: string, side: "front" | "back", file: File) => {
    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("side", side);
    formData.append("image", file);
    return postFormData<AadhaarUploadResult>(
      "/distributor/existing-booking/upload-aadhaar",
      formData
    );
  },

  submitFinalUtr: (
    bookingId: string,
    utr: string,
    distributorDetails: {
      panCard: string;
      aadhaarAddress: string;
      shopName: string;
      shopAddress: string;
      referralCode?: string;
    }
  ) =>
    post<{ bookingId: string; status: string }>(
      "/distributor/existing-booking/submit-final-utr",
      { bookingId, utr, ...distributorDetails }
    ),
};

export { ApiError };