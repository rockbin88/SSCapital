import researchJson from "../data/research.json";

export type ResearchPost = {
  slug: string;
  publishedAt: string;
  readTime: string;
  tag: string;
  title: string;
  excerpt: string;
  mainstream: string;
  ss: string;
};

export const PAGE_SIZE = 10;

function sortPosts(posts: ResearchPost[]): ResearchPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getAllPosts(): ResearchPost[] {
  return sortPosts(researchJson as ResearchPost[]);
}

export function getPostBySlug(slug: string): ResearchPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getLatestPost(): ResearchPost | undefined {
  return getAllPosts()[0];
}

export function getTotalPages(): number {
  return Math.max(1, Math.ceil(getAllPosts().length / PAGE_SIZE));
}

export function getPostsForPage(page: number): ResearchPost[] {
  const start = (page - 1) * PAGE_SIZE;
  return getAllPosts().slice(start, start + PAGE_SIZE);
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export function pageUrl(page: number): string {
  return page <= 1 ? "/research/" : `/research/page/${page}/`;
}
