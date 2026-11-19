
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

type Blog = {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  coverImage?: string | null;
  authorName?: string;
  createdAt?: any;
  publishedAt?: any;
};

type BlogGridProps = {
  blogs: Blog[];
  formatDate: (timestamp: any) => string;
};

export default function BlogGrid({
  blogs,
  formatDate,
}: BlogGridProps) {
  return (
    <section className="bg-[#F5F0E5] px-6 py-16 md:px-12 md:py-20 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#829181]">
              Explore our journal
            </p>
            <h2
              className="text-4xl text-[#29382F] md:text-5xl"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Latest Articles
            </h2>
          </div>

          <span className="hidden text-xs text-[#829181] sm:block">
            Ideas for your next stage of growth
          </span>
        </div>

        {blogs.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#667267]">
            No more articles to display.
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article key={blog.id} className="group min-w-0">
                <Link
                  href={`/blog/${blog.slug || blog.id}`}
                  className="block"
                >
                  <div className="relative mb-5 aspect-[4/3] max-h-[210px] overflow-hidden bg-[#E5E0D4]">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title || "Blog article"}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#667267]">
                        Article image
                      </div>
                    )}

                    <span className="absolute left-0 top-0 bg-[#29382F] px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-white">
                      {blog.category || "Insights"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-[#829181]">
                    <CalendarDays size={12} />
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </div>

                  <h3
                    className="mt-3 text-2xl leading-tight text-[#29382F] transition group-hover:text-[#506B59]"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {blog.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-xs leading-6 text-[#667267]">
                    {blog.excerpt}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#405C48]">
                    Read More
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
