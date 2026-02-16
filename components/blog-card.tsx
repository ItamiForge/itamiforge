import Link from "next/link";

type BlogCardProps = {
  title: string;
  description?: string;
  slug: string;
  date: Date;
  tags?: string[];
};

export function BlogCard({
  title,
  description,
  slug,
  date,
  tags = [],
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="card block h-full">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground leading-6">
        {description ?? "No description available."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={`${slug}-${tag}`} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
