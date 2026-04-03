import { BlogCard } from "@/components/blog-card";
import { blogSource } from "@/lib/source";

export default function BlogIndexPage() {
  const posts = blogSource
    .getPages()
    .filter((post) => !post.data.draft)
    .filter((post) => post.slugs[0])
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return (
    <div className="main-page-content space-y-10 pb-10">
      <section className="bento-grid">
        {posts.map((post) => {
          const slug = post.slugs[0];
          if (!slug) {
            return null;
          }

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
