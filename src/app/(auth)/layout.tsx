export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Visual / Brand Side */}
      <div className="hidden lg:flex w-1/2 bg-zinc-50 border-r border-zinc-100 flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-semibold text-xl tracking-tight text-zinc-900">OmniPresence</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h2 className="text-3xl font-medium tracking-tight text-zinc-900">
            Scale your presence effortlessly.
          </h2>
          <p className="text-zinc-500 leading-relaxed text-lg">
            Create high-fidelity video content using AI. Just bring your script, and let your digital twin do the talking.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
