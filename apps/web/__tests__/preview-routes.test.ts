import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

process.env.SANITY_PREVIEW_SECRET = "test-secret";
process.env.SANITY_PROJECT_ID = "test-project";
process.env.SANITY_DATASET = "test-dataset";

const mockDraftMode = {
  enable: vi.fn(),
  disable: vi.fn(),
};

vi.mock("next/headers", () => ({
  draftMode: () => mockDraftMode,
}));

const getPageBySlug = vi.fn();

vi.mock("@/lib/page-service", () => ({
  getPageBySlug,
}));

describe("Preview routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    getPageBySlug.mockReset();
  });

  it("returns 401 when secret is invalid", async () => {
    const { GET } = await import("../app/api/preview/route");
    const request = new Request("http://localhost/api/preview?secret=wrong&slug=accueil");

    const response = await GET(request as Request);

    expect(response.status).toBe(401);
    expect(mockDraftMode.enable).not.toHaveBeenCalled();
  });

  it("returns 404 when page not found", async () => {
    const { GET } = await import("../app/api/preview/route");
    getPageBySlug.mockResolvedValueOnce(null);
    const request = new Request("http://localhost/api/preview?secret=test-secret&slug=oasis");

    const response = await GET(request as Request);

    expect(response.status).toBe(404);
    expect(mockDraftMode.enable).not.toHaveBeenCalled();
  });

  it("enables draft mode and redirects when slug valid", async () => {
    const { GET } = await import("../app/api/preview/route");
    getPageBySlug.mockResolvedValueOnce({ slug: "accueil", title: "Accueil" });
    const request = new Request("http://localhost/api/preview?secret=test-secret&slug=accueil");

    const response = await GET(request as Request);

    expect(mockDraftMode.enable).toHaveBeenCalled();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/preview/accueil");
  });

  it("disables draft mode on exit preview", async () => {
    const { GET } = await import("../app/api/exit-preview/route");
    const request = new Request("http://localhost/api/exit-preview?slug=services");

    const response = await GET(request as Request);

    expect(mockDraftMode.disable).toHaveBeenCalled();
    expect(response.headers.get("location")).toBe("http://localhost/services");
  });
});
