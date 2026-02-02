export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-2 min-h-0">
        {children}
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-default-100 z-1">
        <h1 className="w-full pt-4 pb-4 text-center">
          Made with ❤️ by <span className="text-yellow-500 font-[Larken] font-bold">Camp Talusi</span>
          <span className="ml-4 mr-4 font-bold">·</span>
          <a target="_blank" href="https://github.com/xi-pec/tiramiso-client" className="text-primary underline">Source</a>
        </h1>
      </footer>
    </div>
  );
}
