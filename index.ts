import { Hono } from "hono";
import puppeteer from "puppeteer";

const app = new Hono();

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox"],
});

const page = await browser.newPage();

app.post("/", async (context) => {
  const { path, html, file_name } = (await context.req.json()) as {
    path: string;
    html: string;
    file_name: string;
  };

  await page.setContent(html);
  const product = await page.waitForSelector("div#product");
  await product?.screenshot({
    path: `${path}/${file_name}`,
    omitBackground: true,
  });

  return context.json({ success: true });
});

Bun.serve({
  port: 3000,
  hostname: "localhost",
  fetch: app.fetch,
});
