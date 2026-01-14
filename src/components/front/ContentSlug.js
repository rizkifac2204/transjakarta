import { getHalamanBySlug } from "@/libs/halaman";
import { sanitizeHTML } from "@/utils/sanitizeHTML";

export default async function ContentSlug({ slug }) {
  const data = await getHalamanBySlug(slug);
  const safeHTML = data?.isi ? sanitizeHTML(data.isi) : "";

  return (
    <div
      className="prose prose-slate dark:prose-invert max-w-none ql-editor-style"
      dangerouslySetInnerHTML={{ __html: safeHTML }}
    />
  );
}
