
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";

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

type LeadArticleProps = {
  blog: Blog;
  formatDate: (timestamp: any) => string;
};

export default function LeadArticle({
  blog,
  formatDate,
}: LeadArticleProps) {
  return (
    <section className="bg-[#FFFDF8] px-6 pb-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative grid items-center lg:grid-cols-[1.35fr_0.65fr]">
          {/* Article image */}
          <div className="relative h-[280px] overflow-hidden bg-[#E9E5DA] sm:h-[360px] lg:h-[390px]">
            {blog.coverImage ? (
              <img
                src={blog.coverImage}
                alt={blog.title || "Featured article"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#B6CBA9] text-sm text-[#29382F]">
                Featured article
              </div>
            )}

            <div className="absolute left-5 top-5 rounded-full bg-[#29382F] px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-white">
              {blog.category || "Featured"}
            </div>
          </div>

          {/* Content card */}
          <div className="relative z-10 -mt-10 ml-5 bg-white p-6 shadow-[0_15px_45px_rgba(41,56,47,0.08)] sm:ml-10 sm:p-9 lg:-ml-16 lg:mt-0 lg:p-10">
            <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#829181]">
              Featured Article
            </p>

            <h2
              className="text-3xl leading-[1.05] text-[#29382F] sm:text-4xl"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              {blog.title}
            </h2>

            <p className="mt-5 line-clamp-4 text-xs leading-6 text-[#667267]">
              {blog.excerpt || "Discover our latest insights and ideas."}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] text-[#829181]">
              <CalendarDays size={13} />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </div>

            <Link
              href={`/blog/${blog.slug || blog.id}`}
              className="mt-7 inline-flex items-center gap-3 bg-[#29382F] px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-white transition hover:bg-[#506B59]"
            >
              Read Article
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
