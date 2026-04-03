export interface LearnCourseMetaPart {
  number: number;
  title: string;
  filename: string;
  chapters: string[];
}

export interface LearnCourseMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  chapters: number;
  estimatedMinutes: number;
  tags: string[];
  parts: LearnCourseMetaPart[];
  status: "complete" | "in-progress" | "draft";
  featured: boolean;
}

export interface LearnCourseChapter {
  id: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  html: string;
}

export interface LearnCoursePart {
  number: number;
  title: string;
  filename: string;
  chapters: LearnCourseChapter[];
}

export interface LearnCourseDocument {
  meta: LearnCourseMeta;
  parts: LearnCoursePart[];
}

export const LEARN_COURSE_LIBRARY: LearnCourseMeta[] = [
  {
    id: "ml101",
    slug: "ml101",
    title: "ML 101",
    description:
      "An exhaustive introduction to machine learning fundamentals. Covers the ML landscape, gradient descent, bias-variance tradeoff, linear regression, logistic regression, decision trees, ensembles, SVMs, neural networks, clustering, dimensionality reduction, and model evaluation metrics.",
    chapters: 11,
    estimatedMinutes: 90,
    tags: ["foundations", "supervised", "unsupervised", "beginner-friendly"],
    parts: [
      {
        number: 1,
        title: "Complete Course",
        filename: "part-01.html",
        chapters: [
          "The ML Landscape",
          "Gradient Descent",
          "Bias–Variance Tradeoff",
          "Linear Regression",
          "Logistic Regression",
          "Decision Trees & Ensembles",
          "Support Vector Machines",
          "Neural Networks",
          "Clustering (K-Means)",
          "Dimensionality Reduction",
          "Model Evaluation Metrics",
        ],
      },
    ],
    status: "complete",
    featured: true,
  },
  {
    id: "mlalgos101",
    slug: "mlalgos101",
    title: "ML Algorithms 101",
    description:
      "An exhaustive algorithm reference spanning classical ML, gradient boosting, time series, deep learning, and AutoML. Part 1 covers sklearn foundations (Ridge, Lasso, Trees, SVMs, KNN). Part 2 covers advanced algorithms (XGBoost, LightGBM, CatBoost, ARIMA, Prophet, Anomaly Detection). Part 3 covers deep learning (PyTorch, Keras, CNNs, RNNs, Transformers, RL, AutoML).",
    chapters: 21,
    estimatedMinutes: 180,
    tags: ["algorithms", "sklearn", "boosting", "deep-learning", "reference"],
    parts: [
      {
        number: 1,
        title: "Part 1: Scikit-Learn Foundation",
        filename: "part-01.html",
        chapters: [
          "Ridge & Lasso Regression",
          "Elastic Net",
          "Logistic Regression",
          "Decision Trees",
          "Random Forests",
          "Naive Bayes",
          "k-Nearest Neighbors",
          "Support Vector Machines",
        ],
      },
      {
        number: 2,
        title: "Part 2: Advanced ML & Time Series",
        filename: "part-02.html",
        chapters: [
          "Gradient Boosting (sklearn)",
          "XGBoost",
          "LightGBM",
          "CatBoost",
          "ARIMA & Classical Time Series",
          "Prophet & Modern Forecasting",
          "Anomaly Detection",
        ],
      },
      {
        number: 3,
        title: "Part 3: Deep Learning & AutoML",
        filename: "part-03.html",
        chapters: [
          "PyTorch Basics",
          "Keras/TensorFlow",
          "Convolutional Neural Networks",
          "RNNs & Transformers",
          "Reinforcement Learning",
          "AutoML & Hyperparameter Optimization",
        ],
      },
    ],
    status: "complete",
    featured: true,
  },
];

export function getLearnCourseMetaBySlug(slug: string): LearnCourseMeta | undefined {
  return LEARN_COURSE_LIBRARY.find((learnCourseMeta) => learnCourseMeta.slug === slug);
}

export function getFeaturedLearnCourses(): LearnCourseMeta[] {
  return LEARN_COURSE_LIBRARY.filter(
    (learnCourseMeta) => learnCourseMeta.featured && "complete" === learnCourseMeta.status
  );
}

export function getAllLearnCourses(): LearnCourseMeta[] {
  return LEARN_COURSE_LIBRARY.filter((learnCourseMeta) => "complete" === learnCourseMeta.status);
}

export function getLearnCourseSlugs(): string[] {
  return getAllLearnCourses().map((learnCourseMeta) => learnCourseMeta.slug);
}

function decodeHtml(value: string): string {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function stripTags(value: string): string {
  return decodeHtml(
    value
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function matchText(source: string, expression: RegExp): string {
  return stripTags(source.match(expression)?.[1] ?? "");
}

function extractLearnCourseChapters(html: string): LearnCourseChapter[] {
  const chapterPattern =
    /<div class="chapter(?: active)?" id="([^"]+)">([\s\S]*?)<\/div>\s*(?=<!-- =========== CHAPTER|\s*<\/main>)/g;
  const chapters: LearnCourseChapter[] = [];

  for (const match of html.matchAll(chapterPattern)) {
    const [, id, body] = match;

    chapters.push({
      id,
      eyebrow: matchText(body, /<div class="ch-eyebrow">([\s\S]*?)<\/div>/),
      title: matchText(body, /<h1 class="ch-title">([\s\S]*?)<\/h1>/),
      subtitle: matchText(body, /<p class="ch-subtitle">([\s\S]*?)<\/p>/),
      html: body
        .replace(/<div class="ch-eyebrow">[\s\S]*?<\/div>/, "")
        .replace(/<h1 class="ch-title">[\s\S]*?<\/h1>/, "")
        .replace(/<p class="ch-subtitle">[\s\S]*?<\/p>/, "")
        .replace(/<div class="ch-nav">[\s\S]*?<\/div>\s*$/, "")
        .trim(),
    });
  }

  return chapters;
}

export async function getLearnCourseBySlug(slug: string): Promise<LearnCourseDocument | undefined> {
  const learnCourseMeta = getLearnCourseMetaBySlug(slug);

  if (!learnCourseMeta) {
    return undefined;
  }

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const learnCourseDirectory = path.join(process.cwd(), "content/learn", slug);

  const parts = await Promise.all(
    learnCourseMeta.parts.map(async (part) => {
      const html = await fs.readFile(path.join(learnCourseDirectory, part.filename), "utf-8");

      return {
        number: part.number,
        title: part.title,
        filename: part.filename,
        chapters: extractLearnCourseChapters(html),
      };
    })
  );

  return {
    meta: learnCourseMeta,
    parts,
  };
}
