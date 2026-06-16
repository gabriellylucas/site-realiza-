import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import Login from "../../pages/Auth/Login";
import { AuthContext } from "../../context/AuthContext";

const mockNavigate = vi.fn();
let mockLocationState: { sucesso?: string } | null = null;
let mockLocationPathname = "/login";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: mockLocationState,
      pathname: mockLocationPathname
    })
  };
});

function renderLogin(setUserMock = vi.fn()) {
  return render(
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          user: null,
          setUser: setUserMock
        }}
      >
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
    mockLocationState = null;
    mockLocationPathname = "/login";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve mostrar erro com campos vazios", () => {
    renderLogin();

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(screen.getByText(/preencha todos os campos/i)).toBeInTheDocument();
  });

  it("deve mostrar erro para email inválido", () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/digite seu email/i), {
      target: { value: "email-invalido" }
    });

    fireEvent.change(screen.getByPlaceholderText(/digite sua senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(screen.getByText(/digite um email válido/i)).toBeInTheDocument();
  });

  it("deve mostrar erro para senha curta", () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/digite seu email/i), {
      target: { value: "teste@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/digite sua senha/i), {
      target: { value: "123" }
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(screen.getByText(/senha muito curta/i)).toBeInTheDocument();
  });

  it("deve ter input email e senha com tipos corretos", () => {
    renderLogin();

    expect(screen.getByPlaceholderText(/digite seu email/i)).toHaveAttribute("type", "email");
    expect(screen.getByPlaceholderText(/digite sua senha/i)).toHaveAttribute("type", "password");
  });

  it("deve exibir o link de cadastro", () => {
    renderLogin();

    expect(screen.getByRole("link", { name: /cadastre-se/i })).toBeInTheDocument();
  });

  it("deve exibir mensagem de sucesso vinda da navegação", () => {
    mockLocationState = { sucesso: "Cadastro realizado com sucesso!" };

    renderLogin();

    expect(screen.getByText(/cadastro realizado com sucesso/i)).toBeInTheDocument();
  });

  it("deve navegar novamente após 3 segundos quando existir mensagem de sucesso", () => {
    vi.useFakeTimers();
    mockLocationState = { sucesso: "Cadastro realizado com sucesso!" };

    renderLogin();

    vi.advanceTimersByTime(3000);

    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("deve chamar fetch com os dados corretos no login", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: "token-fake",
        user: {
          id: 1,
          nome: "Gaby",
          email: "gaby@email.com",
          cpf: "12345678901"
        }
      })
    });

    vi.stubGlobal("fetch", fetchMock);

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/digite seu email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/digite sua senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3000/users/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "gaby@email.com",
            senha: "123456"
          })
        })
      );
    });
  });

  it("deve salvar token, atualizar contexto e navegar no login com sucesso", async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const setUserMock = vi.fn();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          token: "token-fake",
          user: {
            id: 1,
            nome: "Gaby",
            email: "gaby@email.com",
            cpf: "12345678901"
          }
        })
      })
    );

    renderLogin(setUserMock);

    fireEvent.change(screen.getByPlaceholderText(/digite seu email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/digite sua senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith("token", "token-fake");
      expect(setUserMock).toHaveBeenCalledWith({
        id: 1,
        nome: "Gaby",
        email: "gaby@email.com",
        cpf: "12345678901"
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("deve mostrar erro vindo da API no login", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Senha inválida"
        })
      })
    );

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/digite seu email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/digite sua senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/senha inválida/i)).toBeInTheDocument();
    });
  });

  it("deve mostrar erro de conexão no login", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Falha")));

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/digite seu email/i), {
      target: { value: "gaby@email.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/digite sua senha/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/erro ao conectar com o servidor/i)).toBeInTheDocument();
    });
  });
});