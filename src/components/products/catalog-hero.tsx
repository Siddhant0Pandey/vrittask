import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";

interface CatalogHeroProps {
  breadcrumbs: readonly Crumb[];
  stats: { label: string; value: string }[];
}

export function CatalogHero({ breadcrumbs, stats }: CatalogHeroProps) {
  return (
    <section className="rounded-[2rem] bg-pine-800 px-6 py-10 text-white sm:px-10 sm:py-14">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <Breadcrumbs items={breadcrumbs} className="[&_a]:text-pine-200 [&_a:hover]:text-white [&_span]:text-citron-200" />
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-6xl">
            The <span className="text-citron-300 italic">catalogue</span>
          </h1>
          <p className="max-w-lg text-base text-pine-100 sm:text-lg">
            Every piece, in one place. Filter by category, set your budget, and find the thing you didn&apos;t know you
            needed.
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-pine-700 px-4 py-3 sm:px-5">
              <dt className="text-[11px] font-semibold tracking-wider text-pine-200 uppercase">{stat.label}</dt>
              <dd className="font-display text-2xl font-bold text-white tabular-nums sm:text-3xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
