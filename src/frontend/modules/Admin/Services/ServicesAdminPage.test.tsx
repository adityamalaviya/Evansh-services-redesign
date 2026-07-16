import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

vi.mock("@backend/services/appwrite", () => ({
  databases: { createDocument: vi.fn().mockResolvedValue({ $id: "1" }) },
  DB_ID: "test-db",
  SERVICES_COLLECTION_ID: "test-collection",
  ID: { unique: () => "unique-id" },
}));

function getImageUrlInput() {
  return screen.getByPlaceholderText(
    /image shown at top of the service card/i
  ) as HTMLInputElement;
}

describe("ServicesAdminPage - Service Image URL sanitization", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("keeps a valid https URL unchanged", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "https://example.com/image.png" } });

    expect(input).toHaveValue("https://example.com/image.png");
  });

  it("keeps a valid http URL unchanged", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "http://example.com/image.png" } });

    expect(input).toHaveValue("http://example.com/image.png");
  });

  it("trims surrounding whitespace from an otherwise valid URL", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "   https://example.com/pic.jpg   " } });

    expect(input).toHaveValue("https://example.com/pic.jpg");
  });

  it("normalizes a bare origin by adding a trailing slash (URL parser behavior)", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "https://example.com" } });

    expect(input).toHaveValue("https://example.com/");
  });

  it("clears the field when the value is empty", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "https://example.com/image.png" } });
    expect(input).toHaveValue("https://example.com/image.png");

    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue("");
  });

  it("clears the field when the value is only whitespace", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "   " } });

    expect(input).toHaveValue("");
  });

  it("rejects a javascript: URL and clears the field", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "javascript:alert(1)" } });

    expect(input).toHaveValue("");
  });

  it("rejects a data: URL and clears the field", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, {
      target: { value: "data:text/html,<script>alert(1)</script>" },
    });

    expect(input).toHaveValue("");
  });

  it("rejects a file: URL and clears the field", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "file:///etc/passwd" } });

    expect(input).toHaveValue("");
  });

  it("rejects unsupported protocols such as ftp:", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "ftp://example.com/image.png" } });

    expect(input).toHaveValue("");
  });

  it("rejects malformed input that cannot be parsed as a URL", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "not a url" } });

    expect(input).toHaveValue("");
  });

  it("does not render the image preview when the URL is rejected", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "javascript:alert(1)" } });

    expect(screen.queryByAltText("Service preview")).not.toBeInTheDocument();
  });

  it("renders the image preview with the sanitized src when a valid URL is provided", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "https://example.com/image.png" } });

    const preview = screen.getByAltText("Service preview") as HTMLImageElement;
    expect(preview).toBeInTheDocument();
    expect(preview.src).toBe("https://example.com/image.png");
  });

  it("removes a previously rendered preview once a malicious value replaces a valid one", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "https://example.com/image.png" } });
    expect(screen.getByAltText("Service preview")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "javascript:alert(document.domain)" } });
    expect(screen.queryByAltText("Service preview")).not.toBeInTheDocument();
  });

  it("accepts a full URL supplied in a single change event (e.g. paste)", () => {
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    fireEvent.change(input, { target: { value: "https://example.com/pic.png" } });

    expect(input).toHaveValue("https://example.com/pic.png");
  });

  it("cannot accumulate a value when typed character-by-character, since every partial string fails URL parsing (regression)", async () => {
    const user = userEvent.setup();
    render(<ServicesAdminPage />);
    const input = getImageUrlInput();

    await user.type(input, "https://example.com/pic.png");

    // Sanitization runs on every keystroke and resets the controlled value to
    // "" whenever the partial string is not yet a valid absolute URL, so
    // typing character-by-character never builds up a value.
    expect(input).toHaveValue("");
  });
});