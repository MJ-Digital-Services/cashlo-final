"use client";

import Container from "@/components/ui/Container";
import { useShutterStreet } from "@/hooks/useShutterStreet";
import {
  Store,
  ShoppingBasket,
  Smartphone,
  Cross,
  Tv,
  Computer,
  ShoppingCart,
  UtensilsCrossed,
  Coffee,
  Shirt,
  Hammer,
  PenLine,
  Sparkles,
} from "lucide-react";

const shops = [
  { icon: Store, label: "Kirana Stores" },
  { icon: ShoppingBasket, label: "Grocery Shops" },
  { icon: Smartphone, label: "Mobile Stores" },
  { icon: Cross, label: "Medical Stores" },
  { icon: Tv, label: "Electronics Shops" },
  { icon: Computer, label: "CSC Centers" },
  { icon: ShoppingCart, label: "Supermarkets" },
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Coffee, label: "Tea Stalls" },
  { icon: Shirt, label: "Garment Shops" },
  { icon: Hammer, label: "Hardware Stores" },
  { icon: PenLine, label: "Stationery Shops" },
];

/* the 13th — "Any Retail Business" — is rendered separately as the
   wide always-open shop at the end of the street */

export default function WhoCanUse() {
  const scope = useShutterStreet();

  return (
    <section className="bg-surface py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Who Can Use Cashlo?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Every Shutter on the Street
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/60">
            If your shop has a shutter, Cashlo fits behind it. Hover a shop to
            peek inside.
          </p>
        </div>

        {/* the street */}
        <div
          ref={scope}
          className="shutter-street mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {shops.map((s) => (
            <div
              key={s.label}
              data-shop
              tabIndex={0}
              className="shop"
              aria-label={`${s.label} — Cashlo accepted`}
            >
              {/* signboard */}
              <div className="shop__sign">
                <span>{s.label}</span>
              </div>

              {/* awning */}
              <div className="shop__awning" aria-hidden="true" />

              {/* doorway: interior behind, shutter in front */}
              <div data-doorway className="shop__doorway">
                <div data-interior className="shop__interior">
                  <span className="shop__icon">
                    <s.icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <span className="shop__sticker">
                    <i className="shop__qr" aria-hidden="true" />
                    Cashlo accepted
                  </span>
                </div>
                <div data-shutter className="shop__shutter">
                  <span className="shop__handle" aria-hidden="true" />
                </div>
              </div>
            </div>
          ))}

          {/* the 13th shop — always open, spans wider */}
          {/* <div className="shop shop--open col-span-2 lg:col-span-2">
            <div className="shop__sign shop__sign--brand">
              <span>Any Retail Business</span>
            </div>
            <div className="shop__awning" aria-hidden="true" />
            <div className="shop__doorway">
              <div className="shop__interior shop__interior--visible">
                <span className="shop__icon">
                  <Sparkles className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <p className="shop__tagline">
                  If you sell, Cashlo works. No shutter required.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </Container>
    </section>
  );
}