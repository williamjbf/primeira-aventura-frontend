import { test, expect } from "@playwright/test";

test.describe("RegisterForm", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/register");
  });

  test("renderiza todos os campos e botão", async ({ page }) => {
    await page.goto("http://localhost:3000/register");

    await expect(page.getByLabel("Usuário")).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel(/^Senha$/)).toBeVisible();
    await expect(page.getByLabel("Confirmar Senha")).toBeVisible();
    await expect(page.getByRole("button", { name: "Registrar" })).toBeVisible();
  });

  test("valida senhas diferentes", async ({ page }) => {
    await page.goto("http://localhost:3000/register");

    await page.fill("input[name='username']", "testuser");
    await page.fill("input[name='email']", "teste@teste.com");
    await page.fill("input[name='password']", "123456");
    await page.fill("input[name='confirmPassword']", "654321");

    await page.click("button[type='submit']");

    await expect(page.getByText("As senhas não coincidem")).toBeVisible();
  });

  test("registro bem-sucedido redireciona", async ({ page, context }) => {
    await page.goto("http://localhost:3000/register");

    const timestamp = Date.now();
    const username = `user${timestamp}`;
    const email = `user${timestamp}@teste.com`;
    const password = "123456";

    await page.fill("input[name='username']", username);
    await page.fill("input[name='email']", email);
    await page.fill("input[name='password']", password);
    await page.fill("input[name='confirmPassword']", password);

    await page.click("button[type='submit']");

    await expect(page).toHaveURL("http://localhost:3000");

    const cookies = await context.cookies();
    const authToken = cookies.find(c => c.name === "authToken")?.value;
    expect(authToken).toBeTruthy();
  });

  test("exibe erros de campo da API", async ({ page }) => {
    await page.goto("http://localhost:3000/register");

    await page.fill("input[name='username']", "admin");
    await page.fill("input[name='email']", "admin@mail.com");
    await page.fill("input[name='password']", "123456");
    await page.fill("input[name='confirmPassword']", "123456");

    await page.click("button[type='submit']");

    await expect(page.getByText("Username já está em uso")).toBeVisible();
    await expect(page.getByText("Email já está em uso")).toBeVisible();

  });
});
