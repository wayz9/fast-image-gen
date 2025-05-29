import type { PropsWithChildren } from "hono/jsx";

export default function Layout({ children }: PropsWithChildren) {
  const cssOutput = new URL("static/output.css", Bun.env.APP_URL!);

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href={cssOutput.toString()} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
