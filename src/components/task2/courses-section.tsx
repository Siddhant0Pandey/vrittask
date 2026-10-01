import { CourseStats, type CourseStat } from "./course-stats";
import { SectionContainer } from "./section-container";

const STATS: CourseStat[] = [
  {
    id: "all",
    count: "23",
    title: "All Courses",
    description: "courses you're powering through right now.",
    descriptionWidth: 218,
  },
  {
    id: "upcoming",
    count: "05",
    title: "Upcoming Courses",
    description: "exciting new courses waiting to boost your skills.",
    descriptionWidth: 250,
  },
  {
    id: "ongoing",
    count: "10",
    title: "Ongoing Courses",
    description: "currently happening—don’t miss out on the action!",
    descriptionWidth: 260,
  },
];

/** Figma frame "Course" (1440 × 797). */
export function CoursesSection() {
  return (
    <section id="courses" aria-labelledby="courses-heading" className="py-16 lg:py-[100px]">
      <SectionContainer>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-5">
            <p className="font-outfit text-lg leading-snug text-t2-muted sm:text-2xl sm:leading-[30.2px]">
              Explore our classes and master trending skills!
            </p>
            <h2
              id="courses-heading"
              className="font-nohemi text-2xl leading-tight font-bold sm:text-[32px] sm:leading-[38.4px]"
            >
              <span className="text-t2-heading">Dive Into</span>{" "}
              <span className="text-t2-mint">
                What’s Hot Right Now! <span aria-hidden>🔥</span>
              </span>
            </h2>
          </div>
          <CourseStats stats={STATS} />
        </div>
      </SectionContainer>
    </section>
  );
}
