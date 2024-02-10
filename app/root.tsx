import type { LoaderFunctionArgs, LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useRouteError,
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  json,
} from "@remix-run/react";
import { useEffect } from "react";
import { getToast } from "remix-toast";
import { toast as notify } from "sonner";
import { Toaster } from "~/components/ui/sonner";
import cssStyles from "@smastrom/react-rating/style.css";
import tailwindStyles from "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: cssStyles },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  return json({ toast }, { headers });
};

export default function App() {
  const { toast } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (toast?.type === "error") {
      notify.error(toast.message);
    }
    if (toast?.type === "success") {
      notify.success(toast.message);
    }
  }, [toast]);

  // TODO: session有無に応じて、要素を切り替える
  const links = [
    { text: "ホーム", to: "/" },
    { text: "温泉", to: "/hotsprings" },
    { text: "新規登録", to: "/register" },
    { text: "ログイン", to: "/login" },
  ];

  return (
    <Document>
      <div className="flex min-h-screen flex-col justify-between">
        <header className="bg-gray-800 px-8 py-4">
          <nav>
            <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
              <Link to="/">
                <div className="text-2xl font-bold text-white">
                  YelpHotSpring
                </div>
              </Link>
              <div className="flex items-center gap-x-4">
                {links.map((link) => (
                  <Link
                    key={link.text}
                    to={link.to}
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    {link.text}
                  </Link>
                ))}
                {/* TODO:セッションが存在する場合、ログアウトボタン表示 */}
                <Form action="/logout" method="post">
                  <button className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">
                    ログアウト
                  </button>
                </Form>
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="bg-gray-800 px-8 py-4 text-white">
          <div className="flex justify-center">
            <small>&copy; 2024 example</small>
          </div>
        </footer>
      </div>
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document title={error.statusText}>
        <section className="flex h-svh w-full flex-col items-center justify-center bg-blue-100 text-red-600">
          <h1 className="text-2xl">Oops! 🐸</h1>
          <p>There was an error:</p>
          <pre>
            {error.status} {error.statusText || error.data}
          </pre>
          <Link to="/">Back</Link>
        </section>
      </Document>
    );
  }

  if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  return (
    <Document title="Unknown Error ">
      <h1>Unknown Error</h1>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="ja">
      <head>
        {title ? <title>{title}</title> : null}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster position="top-center" />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
