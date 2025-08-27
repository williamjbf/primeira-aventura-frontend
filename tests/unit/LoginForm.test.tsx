import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { login } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/components/users/LoginForm";

jest.mock("@/services/auth", () => ({
  login: jest.fn(),
}));

jest.mock("next/navigation", () => {
  return {
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
  };
});

describe("LoginForm", () => {
  const push = jest.fn();
  const mockLogin = login as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null), // sem redirectTo
    });
  });

  it("renderiza campos e botão", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("Usuário")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("mostra erro se login falhar", async () => {
    mockLogin.mockRejectedValueOnce({ auth: "Credenciais inválidas" });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Usuário"), {
      target: { value: "john" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Credenciais inválidas")).toBeInTheDocument();
  });

  it("redireciona ao logar com sucesso", async () => {
    mockLogin.mockResolvedValueOnce({ token: "fake-token" });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Usuário"), {
      target: { value: "john" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "secret" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/post-login?redirectTo=%2F")
    );
  });

  it("permite alternar visibilidade da senha", async () => {
    render(<LoginForm />);
    const input = screen.getByLabelText("Senha") as HTMLInputElement;
    const toggleBtn = screen.getByRole("button", { name: /mostrar senha/i });

    expect(input.type).toBe("password");

    fireEvent.click(toggleBtn);
    await waitFor(() => expect(input.type).toBe("text"));

    fireEvent.click(toggleBtn);
    await waitFor(() => expect(input.type).toBe("password"));
  });

  it("desabilita botão durante loading", async () => {
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ token: "t" }), 50))
    );

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Usuário"), {
      target: { value: "john" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "secret" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(screen.getByRole("button", { name: "Entrando..." })).toBeDisabled();
  });
});
