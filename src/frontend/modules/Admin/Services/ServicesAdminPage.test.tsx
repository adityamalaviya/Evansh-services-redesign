import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ServicesAdminPage from "./ServicesAdminPage";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/api", () => ({
  api: {
    adminCreateService: vi.fn().mockResolvedValue({ success: true }),
    adminUploadImage: vi.fn().mockResolvedValue({ file_id: "fid", image_url: "https://example.com/img.png" }),
  },
  formatApiError: vi.fn((_err, fallback) => fallback),
}));

describe("ServicesAdminPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders service form fields correctly", () => {
    render(<ServicesAdminPage />);

    expect(screen.getByPlaceholderText(/e\.g\. Design & Development/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Describe the service offered/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Service/i })).toBeInTheDocument();
  });

  it("allows typing into title and description fields", () => {
    render(<ServicesAdminPage />);

    const titleInput = screen.getByPlaceholderText(/e\.g\. Design & Development/i) as HTMLInputElement;
    const descInput = screen.getByPlaceholderText(/Describe the service offered/i) as HTMLTextAreaElement;

    fireEvent.change(titleInput, { target: { value: "Full Stack Development" } });
    fireEvent.change(descInput, { target: { value: "End-to-end web app development" } });

    expect(titleInput.value).toBe("Full Stack Development");
    expect(descInput.value).toBe("End-to-end web app development");
  });
});