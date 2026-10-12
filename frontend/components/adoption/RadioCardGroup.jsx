export function RadioCardGroup({ label, name, options, register, error }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-ink/80">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option}
            className="group relative flex cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-center text-sm font-semibold text-ink transition-all duration-200 hover:border-primary/50 hover:bg-white has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary has-[:checked]:shadow-sm"
          >
            <input
              type="radio"
              value={option}
              className="sr-only"
              {...register(name)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
