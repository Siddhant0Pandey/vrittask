import { CtaButton } from "./cta-button";
import { DragCarousel, type CarouselSlide } from "./drag-carousel";
import { Partners, type Partner } from "./partners";
import { RotatingWords } from "./rotating-words";
import { SectionContainer } from "./section-container";

const SERVICES = ["UI & UX", "Development", "Blockchain"] as const;

const SLIDES: CarouselSlide[] = [
  { src: "/task2/slide-1.jpg", alt: "Person reviewing analytics on a laptop at a bright desk" },
  { src: "/task2/slide-2.jpg", alt: "Conference phone and remote control on a white desk" },
  { src: "/task2/slide-1.jpg", alt: "Person reviewing analytics on a laptop at a bright desk" },
  { src: "/task2/slide-2.jpg", alt: "Conference phone and remote control on a white desk" },
];

const PARTNERS: Partner[] = [
  { name: "Cloud Education", logo: "/task2/partner-cloud-education.png", width: 143, height: 75 },
  { name: "CMC", logo: "/task2/partner-cmc.png", width: 143, height: 75 },
  { name: "IT SNP", logo: "/task2/partner-it-snp.png", width: 143, height: 75 },
  { name: "Zebec", logo: "/task2/partner-zebec.png", width: 143, height: 75 },
];

/** Figma frame "service" (1440 × 1747). */
export function ServicesSection() {
  return (
    <section aria-label="Our services" className="overflow-x-clip py-16 lg:py-[137px]">
      <SectionContainer>
        <div className="flex flex-col gap-24 lg:gap-[193px]">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-10 min-[1440px]:justify-start min-[1440px]:gap-[202px]">
            <div className="flex max-w-[625px] flex-col items-start gap-10 lg:gap-[58px]">
              <p className="font-oakes text-2xl leading-[1.4] font-medium text-t2-text sm:text-[36px] sm:leading-[50.4px]">
                Experience our expert solutions tailored to enhance your business with top-tier design, development,
                and animation.
              </p>
              <CtaButton label="Services" hoverLabel="Start Your Project" />
            </div>
            <RotatingWords words={SERVICES} className="lg:w-[337px] lg:shrink-0" />
          </div>

          <DragCarousel slides={SLIDES} />

          <Partners partners={PARTNERS} />
        </div>
      </SectionContainer>
    </section>
  );
}
