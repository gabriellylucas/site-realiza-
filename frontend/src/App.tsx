import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./layouts/Navbar";
import HeroSection from "./components/Hero/HeroSection";
import Section from "./components/Produto/ProdutoSection";
import ProdutoAcao from "./components/Produto/ProdutoAcao";
import Industrial from "./pages/Aplicacoes/Industrial";
import Florestal from "./pages/Aplicacoes/Florestal";
import Urbanos from "./pages/Aplicacoes/Urbanos";
import IncendioA from "./pages/Aplicacoes/IncendioA";
import IncendioB from "./pages/Aplicacoes/IncendioB";
import IncendioD from "./pages/Aplicacoes/IncendioD";
import Footer from "./layouts/Footer";
import Login from "./pages/Auth/Login";
import Cadastro from "./pages/Auth/Cadastro";
import Orcamento from "./pages/Orcamento/Orcamento";
import MeusOrcamentos from "./pages/Orcamento/MeusOrcamentos";
import EditarOrcamento from "./pages/Orcamento/EditarOrcamento";
import Contato from "./pages/Institucional/Contato";
import Sobre from "./pages/Institucional/Sobre";
import EditarUsuario from "./pages/Perfil/EditarUsuario";
import { AuthProvider } from "./context/AuthContext";
import ListarContatos from "./pages/Institucional/ListarContatos";
import EditarContato from "./pages/Institucional/EditarContato";
import Dashboard from "./pages/Admin/Dashboard";
import AdminOrcamentos from "./pages/Admin/AdminOrcamentos";
import AdminUsuarios from "./pages/Admin/AdminUsuarios";
import AdminRelatorios from "./pages/Admin/AdminRelatorios";
import RotaAdmin from "./components/RotaAdmin/RotaAdmin";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import "./styles/App.css";

function Home() {
  return (
    <>
      <HeroSection />
      <Section />
      <ProdutoAcao />
    </>
  );
}

function BotaoFlutuanteOrcamento() {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/orcamento");
    } else {
      const confirmou = window.confirm(
        "🔐 Área Restrita\n\n" +
        "Para solicitar um orçamento, você precisa estar logado.\n\n" +
        "Você será redirecionado para criar sua conta ou fazer login.\n\n" +
        "Clique em OK para continuar."
      );

      if (confirmou) {
        navigate("/cadastro");
      }
    }
  };

  return (
    <button onClick={handleClick} className="btn-flutuante">
      💰 Orçamento
    </button>
  );
}

function AppWrapper() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const rotasSemNavbarFooter =
    location.pathname === "/login" ||
    location.pathname === "/cadastro" ||
    location.pathname === "/orcamento" ||
    location.pathname === "/meus-orcamentos" ||
    location.pathname === "/editar-usuario" ||
    location.pathname.startsWith("/editar-orcamento") ||
    location.pathname.startsWith("/admin");

  const mostrarBotao =
    location.pathname !== "/login" &&
    location.pathname !== "/cadastro" &&
    location.pathname !== "/orcamento" &&
    location.pathname !== "/meus-orcamentos" &&
    location.pathname !== "/contato" &&
    location.pathname !== "/sobre" &&
    location.pathname !== "/florestal" &&
    location.pathname !== "/industrial" &&
    location.pathname !== "/urbanos" &&
    location.pathname !== "/incendioa" &&
    location.pathname !== "/incendiob" &&
    location.pathname !== "/incendiod" &&
    location.pathname !== "/editar-usuario" &&
    !location.pathname.startsWith("/editar-orcamento") &&
    !location.pathname.startsWith("/admin");

  return (
    <>
      {!rotasSemNavbarFooter && <Navbar />}

      {mostrarBotao && <BotaoFlutuanteOrcamento />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/industrial" element={<Industrial />} />
        <Route path="/florestal" element={<Florestal />} />
        <Route path="/urbanos" element={<Urbanos />} />
        <Route path="/incendioa" element={<IncendioA />} />
        <Route path="/incendiob" element={<IncendioB />} />
        <Route path="/incendiod" element={<IncendioD />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/orcamento" element={<Orcamento />} />
        <Route path="/meus-orcamentos" element={<MeusOrcamentos />} />
        <Route path="/editar-orcamento/:id" element={<EditarOrcamento />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/editar-usuario" element={<EditarUsuario />} />
        <Route path="/contatos" element={<ListarContatos />} />
        <Route path="/editar-contato/:id" element={<EditarContato />} />
        <Route
          path="/admin/dashboard"
          element={
            <RotaAdmin>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </RotaAdmin>
          }
        />
        <Route
          path="/admin/orcamentos"
          element={
            <RotaAdmin>
              <AdminLayout>
                <AdminOrcamentos />
              </AdminLayout>
            </RotaAdmin>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <RotaAdmin>
              <AdminLayout>
                <AdminUsuarios />
              </AdminLayout>
            </RotaAdmin>
          }
        />
        <Route
          path="/admin/relatorios"
          element={
            <RotaAdmin>
              <AdminLayout>
                <AdminRelatorios />
              </AdminLayout>
            </RotaAdmin>
          }
        />
      </Routes>

      {!rotasSemNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;