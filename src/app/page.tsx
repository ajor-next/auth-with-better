import Link from "next/link";

export default function Home() {
  return (
    <div className="py-10 px-10">
      <Link href="/sign-in" className="text-red-200 font-bold bg-slate-500 px-5 py-2 text-xl">Login</Link>
    </div>
  );
}
