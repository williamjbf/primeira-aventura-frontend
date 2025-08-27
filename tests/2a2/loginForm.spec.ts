import { test, expect } from "@playwright/test";
import * as authService from "@/services/auth";

test.describe("LoginForm", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
  });

  test("renderiza todos os campos e botões", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByLabel("Usuário")).toBeVisible();
    await expect(page.getByLabel(/^Senha$/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
    await expect(page.getByText("Não tem uma conta?")).toBeVisible();
  });

  test("permite digitar usuário e senha", async ({ page }) => {
    const userInput = page.getByLabel("Usuário");
    const passInput = page.getByLabel(/^Senha$/);

    await userInput.fill("meuusuario");
    await passInput.fill("minhasenha");

    await expect(userInput).toHaveValue("meuusuario");
    await expect(passInput).toHaveValue("minhasenha");
  });

  test("login bem-sucedido redireciona para HOME", async ({ page, context }) => {
    // Mock do serviço de login
    await page.route("http://localhost:3000/login/api/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "fake-jwt-token" }),
      });
    });

    await page.getByLabel("Usuário").fill("admin");
    await page.getByLabel(/^Senha$/).fill("123456");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL("http://localhost:3000");

    const cookies = await context.cookies();
    const authToken = cookies.find(c => c.name === "authToken")?.value;
    expect(authToken).toBeTruthy();
  });

  test("exibe erro quando login falha", async ({ page }) => {
    await page.route("http://localhost:3000/login/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          "username": "admin123",
          "password": "123456123"
        }),
      });
    });

    await page.getByLabel("Usuário").fill("usuarioerrado");
    await page.getByLabel(/^Senha$/).fill("senhaerrada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Usuário ou senha inválidos")).toBeVisible();
  });
});
