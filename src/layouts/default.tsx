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
      <footer>
        <h1 className="w-full mt-4 mb-4 text-center">Made with ❤️ by <span className="text-yellow-500 font-[Larken] font-bold">Camp Talusi</span></h1>
      </footer>
    </div>
  );
}
