import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import TableDetailsPage from "@/app/table/[id]/page";
import {useAuth} from "@/contexts/AuthContext";
import {buscarMesaPorId, inscreverMesa, salvarMesa} from "@/services/table";
import {getAllTags} from "@/services/tag";
import {useParams, useRouter} from "next/navigation";


jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock("@/services/table");
jest.mock("@/services/tag");

const mockMesa = {
  id: "1",
  titulo: "Mesa de Teste",
  sistema: "D&D 5e",
  resumo: "Uma aventura épica",
  narrador: {id: "10", nome: "Narrador"},
  tags: [],
  imagem: "/img.jpg",
  historico: [],
};

const mockUseAuth = useAuth as jest.Mock;

describe("TableDetailsPage", () => {

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({id: "1"});
    (useRouter as jest.Mock).mockReturnValue({push: mockPush});
    (buscarMesaPorId as jest.Mock).mockResolvedValue(mockMesa);
    (getAllTags as jest.Mock).mockResolvedValue([{id: 1, nome: "Fantasia"}]);
    mockUseAuth.mockReturnValue({
      user: null,
      refreshUser: jest.fn(),
      loading: false,
    });
  });

  it("mostra carregando antes de buscar mesa", async () => {
    render(<TableDetailsPage/>);
    expect(screen.getByText(/Carregando mesa/i)).toBeInTheDocument();
    await waitFor(() => expect(buscarMesaPorId).toHaveBeenCalledWith("1"));
  });

  it("renderiza mesa depois do carregamento", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: "20",
        subscriptions: {pendingList: [], acceptedList: [], deniedList: []}
      }, refreshUser: jest.fn(), loading: false
    });
    render(<TableDetailsPage/>);
    expect(await screen.findByText("Mesa de Teste")).toBeInTheDocument();
    expect(screen.getByText(/Inscrever-se/i)).toBeInTheDocument();
  });

  it("narrador vê botões de edição e gerenciar inscrições", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: "10",
        subscriptions: {pendingList: [], acceptedList: [], deniedList: []}
      }, refreshUser: jest.fn(), loading: false
    });
    render(<TableDetailsPage/>);
    expect(await screen.findByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Gerenciar inscrições")).toBeInTheDocument();
  });

  it("usuário não logado é redirecionado ao tentar inscrever", async () => {
    (useAuth as jest.Mock).mockReturnValue({user: null, refreshUser: jest.fn(), loading: false});
    render(<TableDetailsPage/>);
    fireEvent.click(await screen.findByText(/Inscrever-se/i));
    expect(mockPush).toHaveBeenCalledWith("/login?redirectTo=/table/1");
  });

  it("usuário logado consegue se inscrever", async () => {
    const mockRefresh = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: "20",
        subscriptions: {pendingList: [], acceptedList: [], deniedList: []}
      }, refreshUser: mockRefresh, loading: false
    });
    (inscreverMesa as jest.Mock).mockResolvedValue({});
    render(<TableDetailsPage/>);
    fireEvent.click(await screen.findByText(/Inscrever-se/i));
    await waitFor(() => expect(inscreverMesa).toHaveBeenCalledWith({tableId: 1, userId: 20}));
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("narrador pode salvar mesa ao editar", async () => {
    const mockRefresh = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: "10",
        subscriptions: {pendingList: [], acceptedList: [], deniedList: []}
      }, refreshUser: mockRefresh, loading: false
    });
    (salvarMesa as jest.Mock).mockResolvedValue({});
    render(<TableDetailsPage/>);
    fireEvent.click(await screen.findByText("Editar"));
    fireEvent.click(screen.getByText("Salvar Alterações"));
    await waitFor(() => expect(salvarMesa).toHaveBeenCalled());
  });
});
