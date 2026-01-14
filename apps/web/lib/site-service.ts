import { NAVIGATION_PAGES_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import { sanityClient } from "@/lib/sanity.client";
import type { NavigationPage, SiteSettings, SiteShellData } from "@/types/site";

export async function getSiteShellData(): Promise<SiteShellData> {
  const [settings, navigation] = await Promise.all([
    sanityClient.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
    sanityClient.fetch<NavigationPage[]>(NAVIGATION_PAGES_QUERY),
  ]);

  return {
    settings: settings || null,
    navigation: navigation?.filter((page): page is NavigationPage => Boolean(page?.slug && page?.title)) ?? [],
  };
}
