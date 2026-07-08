const customers = [
    { initials: "MS", name: "Md Salman", note: "2 days ago", tag: "collect 9 Jul", amount: "₹1,200", give: false },
    { initials: "SD", name: "Sunita Devi", note: "3 days ago", tag: null, amount: "₹315", give: false },
    { initials: "PS", name: "Pooja Sharma", note: "5 days ago", tag: null, amount: "₹190", give: true },
  ];
  
  export default function LedgerPreview() {
    return (
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <div className="text-lg font-bold text-ink">QuickKhata</div>
            <div className="text-xs text-ink/50">Udhaar ledger · 6 customers</div>
          </div>
          <span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink">
            Export
          </span>
        </div>
  
        {/* Balance card */}
        <div className="mx-5 mt-4 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/70">You will get</div>
              <div className="mt-1 text-2xl font-bold text-emerald-300">₹4,055</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-right">
              <div className="text-xs text-white/70">You will give</div>
              <div className="mt-1 text-2xl font-bold text-orange-300">₹190</div>
            </div>
          </div>
          <div className="mt-4 border-t border-dashed border-white/25 pt-3 text-xs font-medium text-white/85">
            4 customers to collect from
          </div>
        </div>
  
        {/* Filter pills */}
        <div className="mt-4 flex gap-2 px-5">
          {["All", "To Collect", "To Pay", "Settled"].map((f, i) => (
            <span
              key={f}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                i === 0 ? "bg-brand text-white" : "border border-border text-ink/60"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
  
        {/* Customer list */}
        <div className="mt-4 divide-y divide-border border-t border-border">
          {customers.map((c) => (
            <div key={c.name} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                  {c.initials}
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink">{c.name}</div>
                  <div className="text-xs text-ink/50">
                    {c.note}
                    {c.tag && <span className="text-brand"> · {c.tag}</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${c.give ? "text-red-500" : "text-emerald-600"}`}>
                  {c.amount}
                </div>
                <div className={`text-[10px] font-semibold uppercase ${c.give ? "text-red-500" : "text-emerald-600"}`}>
                  {c.give ? "You give" : "You get"}
                </div>
              </div>
            </div>
          ))}
        </div>
  
        <div className="p-5 pt-4">
          <div className="rounded-full bg-emerald-600 py-3 text-center text-sm font-semibold text-white">
            + Add Customer
          </div>
        </div>
      </div>
    );
  }