
import { render, screen } from "@testing-library/react";

import { BlockRenderer } from "@/components/blocks/BlockRenderer";

const heroBlock = {
  _id: "block-hero",
  blockType: "heroLocal" as const,
  data: {
    heading: "Test Heading",
    subheading: "Sub heading",
    primaryCta: "Appeler",
  },
};

describe("BlockRenderer", () => {
  it("renders known blocks without errors", () => {
    render(<BlockRenderer blocks={[heroBlock]} />);
    expect(screen.getByText("Test Heading")).toBeInTheDocument();
    expect(screen.getByText("Sub heading")).toBeInTheDocument();
  });

  it("shows warning for unsupported blocks", () => {
    render(
      <BlockRenderer
        blocks={[
          heroBlock,
          {
            _id: "block-unknown",
            blockType: "unknown" as any,
          },
        ]}
      />
    );

    expect(screen.getByText(/Bloc non supporté/i)).toBeInTheDocument();
  });
});
