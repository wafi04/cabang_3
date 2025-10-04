import { Headset } from "lucide-react";
import Link from "next/link";

export function ContactPerson({ nowa }: { nowa: string }) {
  return (
    <Link
      href={`https://wa.me/${nowa}`}
      className="fixed bottom-0 right-4 z-50 inline-flex items-center space-x-2.5 rounded-t-lg bg-primary pb-2 pl-3 pr-3 pt-3 uppercase text-primary-foreground duration-300 ease-in-out hover:bg-primary md:pr-5"
    >
      <Headset size={20} />
      <span className="hidden text-xs font-medium md:inline">Chat Cs</span>
    </Link>
  );
}
