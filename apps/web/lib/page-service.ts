import { ALL_PAGE_SLUGS_QUERY, PAGE_BY_SLUG_QUERY } from "@/lib/queries";
import { sanityClient } from "@/lib/sanity.client";
import { sanityPreviewClient } from "@/lib/sanity.preview";
import type { PageDocument } from "@/types/blocks";

type PageServiceOptions = {
  preview?: boolean;
};

function getClient(preview?: boolean) {
  return preview ? sanityPreviewClient : sanityClient;
}

export async function getPageBySlug(slug: string, options?: PageServiceOptions): Promise<PageDocument | null> {
  const client = getClient(options?.preview);
  return client.fetch<PageDocument | null>(PAGE_BY_SLUG_QUERY, { slug });
}

export async function getAllPageSlugs(): Promise<string[]> {
  const pages = await sanityClient.fetch<{ slug: string }[]>(ALL_PAGE_SLUGS_QUERY);
  return pages?.map((page) => page.slug).filter(Boolean) ?? [];
}
