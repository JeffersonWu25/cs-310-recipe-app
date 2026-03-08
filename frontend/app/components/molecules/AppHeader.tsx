import { Logo } from "../atoms/Logo";

export function AppHeader() {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <Logo size="md" showText={true} />
      </div>
    </header>
  );
}
