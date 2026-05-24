import type { LearnCourseMeta } from "@/lib/learn";
import Link from "next/link";

type LearnCardProps = {
  learnCourse: LearnCourseMeta;
};

export function LearnCard({ learnCourse }: LearnCardProps) {
  return (
    <article className="learn-card group relative">
      <Link
        href={`/learn/${learnCourse.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${learnCourse.title}`}
      />

      <div className="learn-card__layout relative z-0">
        <div className="learn-card__body">
          <div className="learn-card__header">
            <h3 className="learn-card__title">{learnCourse.title}</h3>
          </div>

          <p className="learn-card__description">{learnCourse.description}</p>

          <div className="learn-card__tags">
            {learnCourse.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="learn-card__tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="learn-card__meta">
          <dl className="learn-card__facts">
            <div className="learn-card__fact">
              <dt>Chapters</dt>
              <dd>{learnCourse.chapters}</dd>
            </div>
            <div className="learn-card__fact">
              <dt>Reading time</dt>
              <dd>~{learnCourse.estimatedMinutes} min</dd>
            </div>
            <div className="learn-card__fact">
              <dt>Format</dt>
              <dd>
                {1 < learnCourse.parts.length
                  ? `${learnCourse.parts.length} parts`
                  : "Single track"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
