import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { register } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import RegisterForm from "@/components/users/RegisterForm";

jest.mock("@/services/auth", () => ({
  register: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockRegister = register as jest.Mock;

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  it("renderiza o formulário corretamente", () => {
    render(<RegisterForm />);
    expect(screen.getByText("Criar Conta")).toBeInTheDocument();
    expect(screen.getByLabelText("Usuário")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrar/i })).toBeInTheDocument();
  });

  it("mostra erro se senhas não coincidirem", async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText("Usuário"), { target: { value: "john" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Confirmar Senha"), { target: { value: "654321" } });

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    expect(await screen.findByText("As senhas não coincidem")).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("redireciona após registro bem-sucedido", async () => {
    mockRegister.mockResolvedValue({});
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Usuário"), { target: { value: "john" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Confirmar Senha"), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith("/post-login?redirectTo=%2F")
    );
  });

  it("exibe erros de campos retornados pela API", async () => {
    mockRegister.mockRejectedValue({ email: "Email inválido" });

    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText("Usuário"), { target: { value: "john" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Confirmar Senha"), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    expect(await screen.findByText("Email inválido")).toBeInTheDocument();
  });

  it("exibe erro inesperado quando API falha sem detalhes", async () => {
    mockRegister.mockRejectedValue("Erro qualquer");

    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText("Usuário"), { target: { value: "john" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Confirmar Senha"), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    expect(await screen.findByText("Erro inesperado")).toBeInTheDocument();
  });

  it("mostra 'Registrando...' enquanto envia", async () => {
    let resolveFn: Function;
    mockRegister.mockImplementation(
      () => new Promise((resolve) => (resolveFn = resolve))
    );

    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText("Usuário"), { target: { value: "john" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Confirmar Senha"), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    expect(await screen.findByText("Registrando...")).toBeInTheDocument();

    resolveFn!({}); // simula finalização da requisição
  });

  it("permite alternar visibilidade da senha", async () => {
    render(<RegisterForm />);
    const input = screen.getByLabelText("Senha") as HTMLInputElement;
    const toggleBtn = screen.getByRole("button", { name: /mostrar senha/i });

    // Inicialmente deve ser password
    expect(input.type).toBe("password");

    // Clicar altera para text
    fireEvent.click(toggleBtn);
    await waitFor(() => expect(input.type).toBe("text"));

    fireEvent.click(toggleBtn);
    await waitFor(() => expect(input.type).toBe("password"));
  });
});
