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

export type CreateOrderResult = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  bookingId: string;
  gst: { baseAmount: number; gstAmount: number; totalAmount: number };
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

export const distributorApi = {
  checkPincode: (pincode: string) =>
    post<PincodeCheckResult>("/distributor/check-pincode", { pincode }),

  sendOtp: (input: DistributorFormInput) =>
    post<{ bookingId: string }>("/distributor/send-otp", input),

  verifyOtp: (bookingId: string, otp: string) =>
    post<{ bookingId: string }>("/distributor/verify-otp", { bookingId, otp }),

  createOrder: (bookingId: string) =>
    post<CreateOrderResult>("/distributor/create-order", { bookingId }),

  verifyPayment: (params: {
    bookingId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => post<{ bookingId: string; lockLost: boolean }>("/distributor/verify-payment", params),
};

export { ApiError };