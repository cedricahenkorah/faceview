import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className="w-full ">
        <div className="m-auto lg:max-w-7xl max-w-3xl px-5 lg:px-5 xl:px-0 py-3 lg:py-5 flex justify-between">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="font-semibold text-sm md:text-base lg:text-lg">
                faceview
              </h1>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
