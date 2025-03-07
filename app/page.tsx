import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  const href = userId ? "/journal" : "/new-user";

  return (
    <div className="w-screen h-screen bg-black text-white flex justify-center items-center">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl mb-4">Beautiful Thinking, Every Day</h1>
        <p className="text-2xl text-white/60 mb-4">
          Eunoia helps you understand and reflect on your emotions. Track your
          daily mood, uncover patterns, and cultivate a more mindful approach to
          life— all it takes is a little honesty.
        </p>
        <div>
          <Link href={href}>
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-lg">
              Get started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
