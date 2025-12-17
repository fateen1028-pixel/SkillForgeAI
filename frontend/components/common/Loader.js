export default function Loader({ size = "default", className = "" }) {
  const sizes = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin`} />
    </div>
  );
}
