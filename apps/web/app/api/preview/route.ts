import { NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { sanityEnv } from "@/lib/env";
import { getPageBySlug } from "@/lib/page-service";

const slugToPreviewPath = (slug: string) => `/preview/${slug === "accueil" ? "accueil" : slug}`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "accueil";

  if (!sanityEnv.previewSecret || secret !== sanityEnv.previewSecret) {
    return new Response("Secret invalide.", { status: 401 });
  }

  const page = await getPageBySlug(slug, { preview: true });

  if (!page) {
    return new Response(`Page introuvable pour le slug "${slug}"`, { status: 404 });
  }

  draftMode().enable();

  const redirectUrl = new URL(slugToPreviewPath(slug), request.url);
  return NextResponse.redirect(redirectUrl);
}
