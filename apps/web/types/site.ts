export interface SiteSettings {
  brandName?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
}

export interface NavigationPage {
  _id: string;
  title: string;
  slug: string;
}

export interface SiteShellData {
  settings: SiteSettings | null;
  navigation: NavigationPage[];
}
