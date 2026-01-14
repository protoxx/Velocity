import { groq } from "next-sanity";

export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    content[]->{
      _id,
      blockType,
      data
    }
  }
`;

export const PREVIEW_PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    content[]->{
      _id,
      blockType,
      data
    }
  }
`;

export const ALL_PAGE_SLUGS_QUERY = groq`
  *[_type == "page" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0]{
    brandName,
    contactEmail,
    phone,
    address
  }
`;

export const NAVIGATION_PAGES_QUERY = groq`
  *[_type == "page" && defined(slug.current)] | order(_createdAt asc){
    _id,
    title,
    "slug": slug.current
  }
`;
