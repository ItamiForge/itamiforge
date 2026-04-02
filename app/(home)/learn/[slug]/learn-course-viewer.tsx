"use client";

import { BookOpen, ChevronLeft, ChevronRight, Layers3 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { LearnCourseDocument } from "@/lib/learn";
import { cn } from "@/lib/utils";

type LearnCourseViewerProps = {
  learnCourse: LearnCourseDocument;
};

export default function LearnCourseViewer({ learnCourse }: LearnCourseViewerProps) {
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const activePart = learnCourse.parts[activePartIndex] ?? learnCourse.parts[0];
  const activeChapter = activePart.chapters[activeChapterIndex] ?? activePart.chapters[0];

  const progress = useMemo(() => {
    const totalChapters = learnCourse.parts.reduce(
      (chapterCount, learnCoursePart) => chapterCount + learnCoursePart.chapters.length,
      0
    );
    const completedChaptersBeforeActivePart = learnCourse.parts
      .slice(0, activePartIndex)
      .reduce((chapterCount, learnCoursePart) => chapterCount + learnCoursePart.chapters.length, 0);

    return {
      totalChapters,
      activeChapterNumber: completedChaptersBeforeActivePart + activeChapterIndex + 1,
    };
  }, [activeChapterIndex, activePartIndex, learnCourse.parts]);

  const progressPercent = (progress.activeChapterNumber / progress.totalChapters) * 100;

  const goToNextChapter = () => {
    if (activeChapterIndex < activePart.chapters.length - 1) {
      setActiveChapterIndex(activeChapterIndex + 1);
      return;
    }

    if (activePartIndex < learnCourse.parts.length - 1) {
      setActivePartIndex(activePartIndex + 1);
      setActiveChapterIndex(0);
    }
  };

  const goToPreviousChapter = () => {
    if (0 < activeChapterIndex) {
      setActiveChapterIndex(activeChapterIndex - 1);
      return;
    }

    if (0 < activePartIndex) {
      const previousPartIndex = activePartIndex - 1;
      setActivePartIndex(previousPartIndex);
      setActiveChapterIndex(learnCourse.parts[previousPartIndex].chapters.length - 1);
    }
  };

  return (
    <div className="learn-viewer-shell main-page-content">
      <section
        className="learn-book"
        style={
          {
            "--texture-url": `url('${process.env.NEXT_PUBLIC_BASE_PATH}/textures/black-paper.png')`,
          } as React.CSSProperties
        }
      >
        <div className="learn-viewer-header">
          <div className="learn-book-header">
            <div className="learn-book-header__intro">
              <Link href="/learn" className="learn-back-button">
                <ChevronLeft size={16} strokeWidth={2.2} />
                <span>Back to library</span>
              </Link>
              <div className="learn-book-header__copy">
                <h1 className="learn-book-title">{learnCourse.meta.title}</h1>
                <p className="learn-book-description">{learnCourse.meta.description}</p>
              </div>
            </div>

            <div className="learn-book-header__status">
              <div className="learn-book-status-card learn-book-status-bento">
                <div className="learn-book-status-bento__progress">
                  <div className="learn-book-status-card__label">
                    <BookOpen size={14} />
                    Progress
                  </div>
                  <div className="learn-book-status-card__value">
                    {progress.activeChapterNumber}
                    <span>/ {progress.totalChapters}</span>
                  </div>
                  <div className="learn-book-status-card__bar" aria-hidden="true">
                    <span style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
                <div className="learn-book-status-bento__cell">
                  <p className="learn-book-status-bento__cell-label">Reading time</p>
                  <p className="learn-book-status-bento__cell-value">
                    ~{learnCourse.meta.estimatedMinutes} min
                  </p>
                </div>
                <div className="learn-book-status-bento__cell">
                  <p className="learn-book-status-bento__cell-label">Structure</p>
                  <p className="learn-book-status-bento__cell-value">
                    {1 < learnCourse.parts.length
                      ? `${learnCourse.parts.length} parts`
                      : "Single track"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="learn-course-grid">
          <aside className="learn-sidebar">
            <div className="learn-sidebar__sticky">
              <div className="learn-sidebar__top">
                <div className="learn-sidebar__heading">
                  <p className="eyebrow text-muted-foreground">Map</p>
                  <span className="learn-sidebar__counter">
                    {progress.activeChapterNumber} / {progress.totalChapters}
                  </span>
                </div>

                <div className="learn-sidebar__bar" aria-hidden="true">
                  <span style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {1 < learnCourse.parts.length && (
                <div className="learn-sidebar__part-pills">
                  {learnCourse.parts.map((learnCoursePart, learnCoursePartIndex) => (
                    <button
                      key={learnCoursePart.filename}
                      type="button"
                      onClick={() => {
                        setActivePartIndex(learnCoursePartIndex);
                        setActiveChapterIndex(0);
                      }}
                      className={cn(
                        "learn-part-pill",
                        learnCoursePartIndex === activePartIndex && "learn-part-pill--active"
                      )}
                    >
                      <Layers3 size={13} />
                      Part {learnCoursePart.number}
                    </button>
                  ))}
                </div>
              )}

              <div className="learn-sidebar__sections">
                {learnCourse.parts.map((learnCoursePart, learnCoursePartIndex) => (
                  <section key={learnCoursePart.filename} className="learn-sidebar__section">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePartIndex(learnCoursePartIndex);
                        setActiveChapterIndex(0);
                      }}
                      className={cn(
                        "learn-part-card",
                        learnCoursePartIndex === activePartIndex && "learn-part-card--active"
                      )}
                    >
                      <p className="eyebrow text-muted-foreground">Part {learnCoursePart.number}</p>
                      <h2 className="learn-part-card__title">{learnCoursePart.title}</h2>
                      <p className="learn-part-card__meta">
                        {learnCoursePart.chapters.length} chapters
                      </p>
                    </button>

                    {learnCoursePartIndex === activePartIndex && (
                      <div className="learn-chapter-list">
                        {learnCoursePart.chapters.map(
                          (learnCourseChapter, learnCourseChapterIndex) => (
                            <button
                              key={learnCourseChapter.id}
                              type="button"
                              onClick={() => setActiveChapterIndex(learnCourseChapterIndex)}
                              className={cn(
                                "learn-chapter-item",
                                learnCourseChapterIndex === activeChapterIndex &&
                                  "learn-chapter-item--active"
                              )}
                            >
                              <span className="learn-chapter-item__num">
                                {String(learnCourseChapterIndex + 1).padStart(2, "0")}
                              </span>
                              <span className="learn-chapter-item__content">
                                <span className="learn-chapter-item__title">
                                  {learnCourseChapter.title}
                                </span>
                                <span className="learn-chapter-item__subtitle">
                                  {learnCourseChapter.subtitle}
                                </span>
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>
          </aside>

          <main className="learn-viewer-main">
            <article className="learn-reading-surface learn-paper">
              <div className="learn-reading-surface__header">
                <div className="learn-reading-surface__eyebrow">
                  <span className="eyebrow text-muted-foreground">{activeChapter.eyebrow}</span>
                  <span className="learn-reading-surface__counter">
                    {progress.activeChapterNumber} of {progress.totalChapters}
                  </span>
                </div>
                <div className="learn-reading-surface__heading">
                  <h2 className="learn-reading-surface__title">{activeChapter.title}</h2>
                  <p className="learn-reading-surface__subtitle">{activeChapter.subtitle}</p>
                </div>
              </div>

              <div
                className="learn-rich-content"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Course content is sourced from trusted local files
                dangerouslySetInnerHTML={{ __html: activeChapter.html }}
              />

              <div className="learn-chapter-nav">
                <button
                  type="button"
                  onClick={goToPreviousChapter}
                  disabled={0 === activePartIndex && 0 === activeChapterIndex}
                  className="learn-nav-button learn-nav-button--secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={goToNextChapter}
                  disabled={
                    activePartIndex === learnCourse.parts.length - 1 &&
                    activeChapterIndex === activePart.chapters.length - 1
                  }
                  className="learn-nav-button disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </article>
          </main>
        </div>
      </section>
    </div>
  );
}
