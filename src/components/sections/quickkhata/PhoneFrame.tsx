import Image from "next/image";

export default function PhoneFrame({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[280px] sm:max-w-[300px]">
      <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-ink/90 bg-ink shadow-2xl">
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-xl bg-ink/90" />
        <Image
          src={src}
          alt={alt}
          width={600}
          height={1300}
          className="h-auto w-full"
          priority
        />
      </div>
    </div>
  );
}