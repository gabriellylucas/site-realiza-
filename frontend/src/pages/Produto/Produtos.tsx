import { useEffect, useState } from "react";
import axios from "axios";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/produtos")
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center" }}>Produtos Realiza</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        {produtos.map((produto) => (
          <div
            key={produto.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          >
            <h2>{produto.nome}</h2>
            <p>{produto.descricao}</p>
            <strong>R$ {produto.preco}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Produtos;