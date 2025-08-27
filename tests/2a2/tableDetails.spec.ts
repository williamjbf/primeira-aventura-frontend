import { test, expect } from "@playwright/test";

// Mock da mesa 2
const mockMesa = {
  id: 2,
  titulo: "O Mistério de Orion",
  resumo: "Exploração de planetas desconhecidos",
  sistema: "Starfinder",
  imagem: "/uploads/default.png",
  local: "Sala 2",
  horario: '{"dia":"Domingo","hora":"18:00"}',
  narrador: { id: 2, nome: "Bob" },
  tags: [{ id: 2, nome: "Sci-Fi" }],
};

// Mock das tags
const mockTags = [
  { id: 1, nome: "Fantasia" },
  { id: 2, nome: "Sci-Fi" },
  { id: 3, nome: "Terror" },
  { id: 4, nome: "Cyberpunk" },
  { id: 5, nome: "Medieval" },
  { id: 6, nome: "Aventura" },
  { id: 7, nome: "Horror" },
  { id: 8, nome: "Steampunk" },
  { id: 9, nome: "Histórico" },
];

test.describe("TableDetailsPage - Mesa 2", () => {
  test.beforeEach(async ({ page }) => {
    // Mock das APIs
    await page.route("**/api/tables/2", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockMesa),
      });
    });

    await page.route("**/api/tags", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockTags),
      });
    });
  });

  test("renderiza detalhes da mesa corretamente", async ({ page }) => {
    await page.goto("http://localhost:3000/table/2");

    await expect(page.getByText("O Mistério de Orion")).toBeVisible();
    await expect(page.getByText("Exploração de planetas desconhecidos")).toBeVisible();
    await expect(page.getByText(/^Starfinder$/)).toBeVisible();
    const narrator = page.getByText("Bob");
    await expect(narrator.first()).toBeVisible();

    // Tags
    const tag = page.getByText("Sci-Fi");
    await expect(tag.first()).toBeVisible();

    // Histórico fake inserido pelo componente
    await expect(page.getByText("Sessão 1: Chegada à Baróvia")).toBeVisible();
    await expect(page.getByText("Sessão 2: A Taverna da Aldeia")).toBeVisible();
  });

  test("redireciona para login se usuário não logado tentar se inscrever", async ({ page }) => {
    await page.goto("http://localhost:3000/table/2");

    const btn = page.getByRole("button", { name: "Inscrever-se" });
    await expect(btn).toBeVisible();

    await btn.click();

    await expect(page).toHaveURL("http://localhost:3000/login?redirectTo=/table/2");
  });
});
