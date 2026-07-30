"use client";

import Image from "next/image";
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
  { icon: Store, label: "Kirana Stores", img: "/shops/kirana-store.jpg" },
  { icon: ShoppingBasket, label: "Grocery Shops", img: "/shops/grocery-shops.jpg" },
  { icon: Smartphone, label: "Mobile Stores", img: "/shops/mobile-store.png" },
  { icon: Cross, label: "Medical Stores", img: "/shops/medical-store.jpg" },
  { icon: Tv, label: "Electronics Shops", img: "/shops/electronic-shops.jpg" },
  { icon: Computer, label: "CSC Centers", img: "/shops/csc-center.jpeg" },
  { icon: ShoppingCart, label: "Supermarkets", img: "/shops/supermarket.jpg" },
  { icon: UtensilsCrossed, label: "Restaurants", img: "/shops/restaurant.jpg" },
  { icon: Coffee, label: "Tea Stalls", img: "/shops/tea-stalls.jpg" },
  { icon: Shirt, label: "Garment Shops", img: "/shops/garment-shops.jpg" },
  { icon: Hammer, label: "Hardware Stores", img: "/shops/hardware-store.jpg" },
  { icon: PenLine, label: "Stationery Shops", img: "/shops/stationery-shops.jpg" },
];

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

        <div
          ref={scope}
          className="shutter-street mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {shops.map((s, i) => (
            <div
              key={s.label}
              data-shop
              tabIndex={0}
              className="shop"
              aria-label={`${s.label} — Cashlo accepted`}
            >
              <div className="shop__sign">
                <span>{s.label}</span>
              </div>

              <div className="shop__awning" aria-hidden="true" />

              <div data-doorway className="shop__doorway">
                <div data-interior className="shop__interior">
                  <Image
                    src={s.img}
                    alt=""
                    fill
                    className="shop__photo"
                    draggable={false}
                    loading={i < 4 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
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
        </div>
      </Container>
    </section>
  );
}