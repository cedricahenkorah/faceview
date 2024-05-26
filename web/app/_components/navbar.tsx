import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="sticky top-0">
      <nav className="w-full border-b border-b-gray-200">
        <div className="m-auto lg:max-w-7xl max-w-3xl px-5 lg:px-5 xl:px-0 py-2 lg:py-3 flex justify-between">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="font-bold text-lg text-white">faceview</h1>
            </Link>
          </div>

          <div className="flex items-center">
            <Link href="/auth">
              <div
                className="inline-flex items-center justify-center px-1 lg:px-3 py-1 text-sm font-bold border-2 border-white transition-all duration-200 bg-white text-violet-800"
                role="button"
              >
                Get Started
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
