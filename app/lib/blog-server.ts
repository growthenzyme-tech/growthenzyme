
type BlogSeoData = {
  title?: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt?: string;
};

function getStringValue(
  fields: Record<string, any>,
  fieldName: string
): string {
  return fields[fieldName]?.stringValue || "";
}

export async function getPublishedBlogSeo(
  slug: string
): Promise<BlogSeoData | null> {
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "growthenzyme-cms";

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    throw new Error("Firebase API key is not configured.");
  }

  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    `/databases/(default)/documents:runQuery?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "blogs" }],
        where: {
          compositeFilter: {
            op: "AND",
            filters: [
              {
                fieldFilter: {
                  field: { fieldPath: "slug" },
                  op: "EQUAL",
                  value: { stringValue: slug },
                },
              },
              {
                fieldFilter: {
                  field: { fieldPath: "status" },
                  op: "EQUAL",
                  value: { stringValue: "published" },
                },
              },
            ],
          },
        },
        limit: 1,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Unable to fetch blog SEO data: ${response.status}`
    );
  }

  const results = await response.json();

  const document = results.find(
    (item: any) => item.document
  )?.document;

  if (!document) return null;

  const fields = document.fields || {};

  return {
    title: getStringValue(fields, "title"),
    seoTitle: getStringValue(fields, "seoTitle"),
    metaDescription: getStringValue(fields, "metaDescription"),
    excerpt: getStringValue(fields, "excerpt"),
  };
}
