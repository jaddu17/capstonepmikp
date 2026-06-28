import { useCuaca } from "../hooks/useCuaca";

export function CuacaBadge() {
  const { current, loading, error } = useCuaca();

  if (error || (!loading && !current)) return null;

  const handleClick = () => {
    document.getElementById("cuaca")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 flex items-center gap-2 text-white hover:bg-white/25 transition-colors"
    >
      {loading || !current ? (
        <span className="text-sm">Memuat cuaca...</span>
      ) : (
        <>
          <current.icon className="w-5 h-5" />
          <span className="font-semibold text-sm">{current.temperature}°C</span>
          <span className="text-xs text-white/80 hidden sm:inline">Kulon Progo</span>
        </>
      )}
    </button>
  );
}