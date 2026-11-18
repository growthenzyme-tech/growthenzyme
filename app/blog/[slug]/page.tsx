import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticleClient from "./BlogArticleClient";
import { getPublishedBlogSeo } from "@/app/lib/blog-server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const blog = await getPublishedBlogSeo(slug);

    if (!blog) {
      return {
        title: "Article Not Found | GrowthEnzyme",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const title =
      blog.seoTitle?.trim() ||
      blog.title ||
      "GrowthEnzyme Journal";

    const description =
      blog.metaDescription?.trim() ||
      blog.excerpt ||
      "Explore insights and strategies from GrowthEnzyme.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("Blog metadata error:", error);

    return {
      title: "GrowthEnzyme Journal",
      description: "Insights, strategies and perspectives from GrowthEnzyme.",
    };
  }
}

export default async function BlogPage({
  params,
}: PageProps) {
  const { slug } = await params;

  let blog;

  try {
    blog = await getPublishedBlogSeo(slug);
  } catch (error) {
    console.error("Blog page lookup error:", error);
    throw error;
  }

  if (!blog) {
    notFound();
  }

  return <BlogArticleClient />;
}
