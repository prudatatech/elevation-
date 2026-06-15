interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="p-xl">
      <div className="flex justify-between items-center mb-xl">
        <div>
          <h2 className="font-[Outfit] text-3xl font-bold">{title}</h2>
          <p className="text-on-surface-variant text-sm mt-xs">This module is under development.</p>
        </div>
      </div>

      <div className="bg-surface p-2xl rounded-2xl border border-outline-variant card-shadow flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-lg">
          <span className="material-symbols-outlined text-[40px] text-primary">construction</span>
        </div>
        <h3 className="font-[Outfit] text-xl font-bold mb-sm">{title} Module</h3>
        <p className="text-on-surface-variant text-sm text-center max-w-md">
          This section will feature comprehensive management tools for {title.toLowerCase()}.
          It is being built to match the full design system.
        </p>
      </div>
    </div>
  );
}
