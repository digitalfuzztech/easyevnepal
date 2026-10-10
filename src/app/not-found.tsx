import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">404</p>
      <h1 className="font-display mt-2 text-4xl font-semibold">This road ends here.</h1>
      <p className="mt-3 text-[15px] text-moss">The page you wanted does not exist — but your EV search does not have to.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/" className="rounded-full bg-deep px-6 py-2.5 text-[13.5px] font-bold text-white">Home</Link>
        <Link href="/evs" className="rounded-full border border-line bg-white px-6 py-2.5 text-[13.5px] font-bold">Browse EVs</Link>
      </div>
    </div>
  );
}
