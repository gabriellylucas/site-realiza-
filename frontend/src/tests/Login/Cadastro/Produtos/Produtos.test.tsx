import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

import Produtos from "../../../../pages/Produto/Produtos";

vi.mock("axios");

const mockedAxios = vi.mocked(axios);

describe("Produtos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar a API de produtos", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(<Produtos />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/produtos");
    });
  });

  it("deve renderizar o título da seção", () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(<Produtos />);

    expect(screen.getByText(/produtos realiza/i)).toBeInTheDocument();
  });

  it("deve renderizar produtos vindos da API", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: 1, nome: "Extintor", descricao: "Produto de teste", preco: 150 }
      ]
    });

    render(<Produtos />);

    await waitFor(() => {
      expect(screen.getByText(/extintor/i)).toBeInTheDocument();
      expect(screen.getByText(/produto de teste/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 150/i)).toBeInTheDocument();
    });
  });

  it("deve renderizar mais de um produto", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: 1, nome: "Produto 1", descricao: "Desc 1", preco: 10 },
        { id: 2, nome: "Produto 2", descricao: "Desc 2", preco: 20 }
      ]
    });

    render(<Produtos />);

    await waitFor(() => {
      expect(screen.getByText(/produto 1/i)).toBeInTheDocument();
      expect(screen.getByText(/produto 2/i)).toBeInTheDocument();
    });
  });

  it("não deve renderizar cards de produto quando a API retornar lista vazia", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(<Produtos />);

    await waitFor(() => {
      expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    });
  });

  it("deve registrar erro no console quando a API falhar", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    mockedAxios.get.mockRejectedValueOnce(new Error("Erro de conexão"));

    render(<Produtos />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(screen.getByText(/produtos realiza/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});