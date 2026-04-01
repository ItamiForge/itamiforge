import { notFound } from "next/navigation";
import {
  getLearnCourseBySlug,
  getLearnCourseMetaBySlug,
  getLearnCourseSlugs,
} from "@/lib/learn";
import LearnCourseViewer from "./learn-course-viewer";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getLearnCourseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const learnCourseMeta = getLearnCourseMetaBySlug(slug);

  if (!learnCourseMeta) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: `${learnCourseMeta.title} — Learn`,
    description: learnCourseMeta.description,
  };
}

export default async function LearnCoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const learnCourse = await getLearnCourseBySlug(slug);

  if (!learnCourse) {
    notFound();
  }

  try {
    return <LearnCourseViewer learnCourse={learnCourse} />;
  } catch {
    return (
      <div className="main-page-content space-y-6 pb-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-200">
          <p className="font-semibold">Unable to load course</p>
          <p className="mt-1 text-sm">
            The course content could not be loaded. Please try again.
          </p>
        </div>
      </div>
    );
  }
}
