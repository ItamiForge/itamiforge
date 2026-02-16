import { BlogCard } from "@/components/blog-card";
import { blogSource } from "@/lib/source";

export default function BlogIndexPage() {
  const posts = blogSource
    .getPages()
    .filter((post) => !post.data.draft)
    .filter((post) => post.slugs[0])
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return (
    <div className="space-y-10 py-10">
      <header className="card">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Blog
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Shipping notes, engineering decisions, and project updates.
        </h1>
      </header>

      <section className="bento-grid">
        {posts.map((post) => {
          const slug = post.slugs[0];
          if (!slug) return null;

          return (
            <div key={post.url} className="bento-card">
              <BlogCard
                title={post.data.title}
                description={post.data.description}
                slug={slug}
                date={post.data.date}
                tags={post.data.tags}
              />
            </div>
          );
        })}
      </section>
    </div>
  );
}
