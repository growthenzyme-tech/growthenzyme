
"use client";

import { useParams } from "next/navigation";
import BlogEditor from "@/app/components/cms/BlogEditor";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="min-h-screen bg-[#f8f8f7] px-5 py-10 md:px-10">
      <BlogEditor blogId={params.id} />
    </main>
  );
}
