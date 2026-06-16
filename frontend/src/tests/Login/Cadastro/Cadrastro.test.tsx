import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import Cadastro from "../../../pages/Auth/Cadastro";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

function renderCadastro() {
  return render(
    <BrowserRouter>
      <Cadastro />
    </BrowserRouter>
  );
}

describe("Cadastro", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("deve mostrar erro com campos vazios", () => {
    renderCadastro();

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(screen.getByText(/preencha todos os campos/i)).toBeInTheDocument();
  });

  it("deve mostrar erro para email inválido", () => {
    renderCadastro();

    fireEvent.change(screen.getByPlaceholderText(/nome/i), {
      target: { value: "Gaby" }
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "email-invalido" }
    });

    fireEvent.change(screen.getByPlaceholderText(/cpf/i), {
      target: { value: "52998224725" }
    });

    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "123456" }
    });

    fireEvent.change(screen.getByPlaceholderText(/confirmar senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(screen.getByText(/digite um email válido/i)).toBeInTheDocument();
  });

  it("deve mostrar erro para CPF inválido", () => {
    renderCadastro();

    fireEvent.change(screen.getByPlaceholderText(/nome/i), {
      target: { value: "Gaby" }
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/cpf/i), {
      target: { value: "11111111111" }
    });

    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "123456" }
    });

    fireEvent.change(screen.getByPlaceholderText(/confirmar senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument();
  });

  it("deve mostrar erro para senha curta", () => {
    renderCadastro();

    fireEvent.change(screen.getByPlaceholderText(/nome/i), {
      target: { value: "Gaby" }
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/cpf/i), {
      target: { value: "52998224725" }
    });

    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "123" }
    });

    fireEvent.change(screen.getByPlaceholderText(/confirmar senha/i), {
      target: { value: "123" }
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(screen.getByText(/mínimo 6 caracteres/i)).toBeInTheDocument();
  });

  it("deve mostrar erro quando as senhas não coincidem", () => {
    renderCadastro();

    fireEvent.change(screen.getByPlaceholderText(/nome/i), {
      target: { value: "Gaby" }
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/cpf/i), {
      target: { value: "52998224725" }
    });

    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "123456" }
    });

    fireEvent.change(screen.getByPlaceholderText(/confirmar senha/i), {
      target: { value: "654321" }
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
  });

  it("deve formatar o CPF enquanto o usuário digita", () => {
    renderCadastro();

    const inputCpf = screen.getByPlaceholderText(/cpf/i);

    fireEvent.change(inputCpf, {
      target: { value: "52998224725" }
    });

    expect(inputCpf).toHaveValue("529.982.247-25");
  });

  it("deve exibir o botão cadastrar", () => {
    renderCadastro();

    expect(screen.getByRole("button", { name: /cadastrar/i })).toBeInTheDocument();
  });

  it("deve exibir o texto de login para quem já tem conta", () => {
    renderCadastro();

    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it("deve chamar a API com CPF sem máscara no cadastro", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "Usuário cadastrado com sucesso"
      })
    });

    vi.stubGlobal("fetch", fetchMock);

    renderCadastro();

    fireEvent.change(screen.getByPlaceholderText(/nome/i), {
      target: { value: "Gaby" }
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/cpf/i), {
      target: { value: "52998224725" }
    });

    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "123456" }
    });

    fireEvent.change(screen.getByPlaceholderText(/confirmar senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3000/users/register",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: "Gaby",
            email: "gaby@email.com",
            cpf: "52998224725",
            senha: "123456"
          })
        })
      );
    });
  });

  it("deve chamar a API e navegar para login no cadastro com sucesso", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "Usuário cadastrado com sucesso"
        })
      })
    );

    renderCadastro();

    fireEvent.change(screen.getByPlaceholderText(/nome/i), {
      target: { value: "Gaby" }
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/cpf/i), {
      target: { value: "52998224725" }
    });

    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "123456" }
    });

    fireEvent.change(screen.getByPlaceholderText(/confirmar senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login", {
        state: { sucesso: "Cadastro realizado com sucesso!" }
      });
    });
  });

  it("deve mostrar erro vindo da API no cadastro", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "CPF inválido"
        })
      })
    );

    renderCadastro();

    fireEvent.change(screen.getByPlaceholderText(/nome/i), {
      target: { value: "Gaby" }
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/cpf/i), {
      target: { value: "52998224725" }
    });

    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "123456" }
    });

    fireEvent.change(screen.getByPlaceholderText(/confirmar senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument();
    });
  });

  it("deve mostrar erro de conexão no cadastro", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Falha")));

    renderCadastro();

    fireEvent.change(screen.getByPlaceholderText(/nome/i), {
      target: { value: "Gaby" }
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/cpf/i), {
      target: { value: "52998224725" }
    });

    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "123456" }
    });

    fireEvent.change(screen.getByPlaceholderText(/confirmar senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/erro ao conectar com o servidor/i)).toBeInTheDocument();
    });
  });
});