import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

const slugToPath = (slug: string) => (slug === "accueil" ? "/" : `/${slug}`);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "accueil";

  draftMode().disable();

  const redirectUrl = new URL(slugToPath(slug), request.url);
  return NextResponse.redirect(redirectUrl);
}
