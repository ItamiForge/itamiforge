import { LearnCard } from "@/components/learn-card";
import { getAllLearnCourses } from "@/lib/learn";

export default function LearnIndexPage() {
  const learnCourses = getAllLearnCourses();
  const tagCounts = Array.from(
    learnCourses
      .flatMap((learnCourse) => learnCourse.tags)
      .reduce((tagMap, tag) => {
        tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
        return tagMap;
      }, new Map<string, number>())
      .entries()
  )
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10);

  const getTagTier = (count: number) => {
    if (count >= 4) return "high";
    if (count >= 2) return "mid";
    return "low";
  };

  return (
    <div className="learn-index-shell main-page-content">
      <header className="learn-index-hero">
        <aside className="learn-index-rail">
          <section className="learn-index-panel">
            <p className="eyebrow text-muted-foreground">Available Courses</p>
            <p className="learn-index-kpi">{learnCourses.length}</p>
          </section>

          <section className="learn-index-panel">
            <p className="eyebrow text-muted-foreground">Tags</p>
            <div className="learn-index-tag-list">
              {tagCounts.map(([tag, count]) => (
                <span
                  key={tag}
                  className="learn-index-tag-chip"
                  data-count-tier={getTagTier(count)}
                >
                  {tag}
                  <span className="learn-index-tag-chip__count">{count}</span>
                </span>
              ))}
            </div>
          </section>
        </aside>
      </header>

      <section className="learn-index-grid">
        {learnCourses.map((learnCourse) => (
          <div key={learnCourse.id}>
            <LearnCard learnCourse={learnCourse} />
          </div>
        ))}
      </section>
    </div>
  );
}
