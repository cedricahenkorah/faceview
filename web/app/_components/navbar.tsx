import { Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
      <nav className="w-full ">
        <div className="m-auto lg:max-w-7xl max-w-3xl px-5 lg:px-5 xl:px-0 py-3 lg:py-5 flex justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-purple-500" />

            <Link href="/">
              <h1 className="font-semibold text-sm md:text-base lg:text-lg text-white">
                faceview
              </h1>
            </Link>
          </div>

          {pathname === "/" && (
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#features"
                className="text-slate-300 hover:text-white transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-slate-300 hover:text-white transition"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="text-slate-300 hover:text-white transition"
              >
                Pricing
              </a>
            </div>
          )}

          <div></div>
        </div>
      </nav>
    </header>
  );
};
