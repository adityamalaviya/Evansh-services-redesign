import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordPage from "@/frontend/modules/Auth/ForgotPasswordPage";
import ResetPasswordPage from "@/frontend/modules/Auth/ResetPasswordPage";
import { account } from "@/lib/appwrite/client";

const pushMock = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("@/lib/appwrite/client", () => ({
  account: {
    createRecovery: vi.fn(),
    updateRecovery: vi.fn(),
  },
}));

describe("Forgot Password & Reset Password E2E Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  describe("Forgot Password Flow", () => {
    it("renders the forgot password page with initial state", () => {
      render(<ForgotPasswordPage />);

      expect(screen.getByRole("heading", { name: /Reset Your/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText("username@gmail.com")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Send Reset Link/i })).toBeInTheDocument();
      expect(screen.getByText(/Remembered your password\?/i)).toBeInTheDocument();
    });

    it("displays validation error when an invalid email format is entered", async () => {
      const { container } = render(<ForgotPasswordPage />);

      const emailInput = screen.getByPlaceholderText("username@gmail.com");
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });

      const form = container.querySelector("form")!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      });
      expect(account.createRecovery).not.toHaveBeenCalled();
    });

    it("calls Appwrite createRecovery with email and resetUrl, and shows success confirmation", async () => {
      (account.createRecovery as any).mockResolvedValueOnce({ $id: "recovery_1" });

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByPlaceholderText("username@gmail.com");
      fireEvent.change(emailInput, { target: { value: "user@example.com" } });

      const submitButton = screen.getByRole("button", { name: /Send Reset Link/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(account.createRecovery).toHaveBeenCalledWith(
          "user@example.com",
          expect.stringContaining("/reset-password")
        );
        expect(screen.getByText(/Check Your Email/i)).toBeInTheDocument();
        expect(screen.getByText("user@example.com")).toBeInTheDocument();
      });
    });

    it("displays error message if Appwrite recovery call fails", async () => {
      (account.createRecovery as any).mockRejectedValueOnce(
        new Error("Rate limit exceeded. Please wait a few minutes.")
      );

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByPlaceholderText("username@gmail.com");
      fireEvent.change(emailInput, { target: { value: "user@example.com" } });

      const submitButton = screen.getByRole("button", { name: /Send Reset Link/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Rate limit exceeded\. Please wait a few minutes\./i)).toBeInTheDocument();
      });
    });
  });

  describe("Reset Password Flow", () => {
    it("shows error warning when missing userId or secret in URL query parameters", () => {
      mockSearchParams = new URLSearchParams(""); // missing params

      render(<ResetPasswordPage />);

      expect(
        screen.getByText(/Invalid or expired reset link\. Please request a new one\./i)
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Update Password/i })).toBeDisabled();
    });

    it("validates password length and matching confirmation before submitting", async () => {
      mockSearchParams = new URLSearchParams("userId=usr_123&secret=sec_456");

      render(<ResetPasswordPage />);

      const passwordInput = screen.getByPlaceholderText("Min. 8 characters");
      const confirmInput = screen.getByPlaceholderText("Re-enter new password");
      const submitButton = screen.getByRole("button", { name: /Update Password/i });

      // Password mismatch
      fireEvent.change(passwordInput, { target: { value: "SecurePass123" } });
      fireEvent.change(confirmInput, { target: { value: "DifferentPass123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match\./i)).toBeInTheDocument();
      });
      expect(account.updateRecovery).not.toHaveBeenCalled();
    });

    it("successfully resets password and shows confirmation state", async () => {
      mockSearchParams = new URLSearchParams("userId=usr_123&secret=sec_456");
      (account.updateRecovery as any).mockResolvedValueOnce({ status: true });

      render(<ResetPasswordPage />);

      const passwordInput = screen.getByPlaceholderText("Min. 8 characters");
      const confirmInput = screen.getByPlaceholderText("Re-enter new password");
      const submitButton = screen.getByRole("button", { name: /Update Password/i });

      fireEvent.change(passwordInput, { target: { value: "NewValidPassword123!" } });
      fireEvent.change(confirmInput, { target: { value: "NewValidPassword123!" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(account.updateRecovery).toHaveBeenCalledWith(
          "usr_123",
          "sec_456",
          "NewValidPassword123!"
        );
        expect(screen.getByText(/Password Updated!/i)).toBeInTheDocument();
      });
    });

    it("displays error message if Appwrite updateRecovery fails (e.g. token expired)", async () => {
      mockSearchParams = new URLSearchParams("userId=usr_123&secret=expired_sec");
      (account.updateRecovery as any).mockRejectedValueOnce(
        new Error("Invalid token or token has expired.")
      );

      render(<ResetPasswordPage />);

      const passwordInput = screen.getByPlaceholderText("Min. 8 characters");
      const confirmInput = screen.getByPlaceholderText("Re-enter new password");
      const submitButton = screen.getByRole("button", { name: /Update Password/i });

      fireEvent.change(passwordInput, { target: { value: "NewValidPassword123!" } });
      fireEvent.change(confirmInput, { target: { value: "NewValidPassword123!" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid token or token has expired\./i)).toBeInTheDocument();
      });
    });
  });
});
