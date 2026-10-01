import Image from "next/image";

export interface Partner {
  name: string;
  logo: string;
  width: number;
  height: number;
}

/** "Our Partners": centred heading, then four 143 × 75 logo slots 162px apart. */
export function Partners({ partners }: { partners: readonly Partner[] }) {
  return (
    <section aria-labelledby="partners-heading" className="flex flex-col items-center gap-[38px]">
      <h2
        id="partners-heading"
        className="font-ui text-[22px] leading-[33px] font-bold tracking-[-0.44px] text-t2-ink"
      >
        Our Partners
      </h2>
      <ul className="grid grid-cols-2 place-items-center gap-x-10 gap-y-8 md:flex md:gap-[clamp(40px,11vw,162px)]">
        {partners.map((partner) => (
          <li key={partner.name} className="grid h-[75px] w-[143px] place-items-center">
            <Image
              src={partner.logo}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              // Figma applies a luminosity blend over white, which renders the logos in grayscale.
              className="max-h-full w-auto object-contain mix-blend-luminosity"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
