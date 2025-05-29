import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import puppeteer from "puppeteer";
import Default from "./templates/default";
import { productSchema, type Product } from "./templates/default/schema";

const app = new Hono();

app.use(
  "/static/*",
  serveStatic({
    root: "./public",
  })
);

app.use(
  "/media/*",
  serveStatic({
    root: "./public",
  })
);

app.get("/", (context) => {
  return context.text(
    'Alive and kicking! Use POST "/generate" to generate images.'
  );
});

app.post("/generate", async (context) => {
  const data = await context.req.json();
  const parsed = productSchema.array().safeParse(data.sources);

  if (!parsed.success) {
    return context.json(
      {
        error: "Invalid product data",
        details: parsed.error.issues,
      },
      400
    );
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // loop through the products array, set the content, save the page as unique_id.png and close the browser;
  try {
    for (const product of parsed.data) {
      const page = await browser.newPage();
      const rendered = <Default product={product} />;

      await page.setContent(rendered.toString());

      const fileName = `./public/media/${product.unique_id}.png`;
      const selected = await page.waitForSelector("div#product");

      await selected!.screenshot({
        path: fileName,
        omitBackground: true,
      });

      await page.close();
    }
  } catch (error) {
    await browser.close();
    return context.json(
      {
        error: "Failed to generate images",
        details: (error as Error).message,
      },
      500
    );
  }

  return context.json({ success: true });
});

app.get("/preview/default", async (context) => {
  const product: Product = {
    unique_id: "1235",
    title: "ACANA Cat First Feast",
    price: 19000,
    discount_price: 17000,
    with_free_shipping: true,
    free_shipping_badge_text: "Free Shipping",
    image:
      "https://cdn.shopify.com/s/files/1/0725/8302/0830/files/acana_cat_pacifica.jpg?v=1742333071",
    currency: "RSD",
    description: "Free shipping on orders over 1000 RSD",
  };

  return context.html(<Default product={product} />);
});

Bun.serve({
  port: 3000,
  hostname: "localhost",
  fetch: app.fetch,
  development: {
    hmr: true,
  },
});
