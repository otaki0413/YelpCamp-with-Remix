import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="relative px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center"></div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            YelpHotSpring
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            日本各地の温泉を紹介、ユーザー同士でレビューできるアプリです
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <Button asChild variant="outline">
              <Link to="/hotsprings/">温泉リストへ</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
