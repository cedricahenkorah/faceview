import { Navbar } from "./_components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="absolute inset-0 -z-10 h-full w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-6xl py-10 sm:py-14 lg:py-24">
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-5xl md:leading-relaxed">
                Stay Connected with FaceView
              </h1>

              <p className="mt-2 lg:mt-4 text-sm lg:text-lg lg:leading-8 text-white font-semibold">
                Connect, converse, and collaborate with people everywhere using
                FaceView.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
