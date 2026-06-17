"use client";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  selected: T[];
  onToggle: (value: T) => void;
  columns?: 1 | 2;
};

export function CheckboxGroup<T extends string>({
  options,
  selected,
  onToggle,
  columns = 2
}: Props<T>) {
  return (
    <div className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {options.map((opt) => {
        const checked = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={`flex items-center gap-2.5 rounded-badge border px-3.5 py-3 text-left text-[13px] font-medium transition-colors ${
              checked
                ? "border-primary bg-primary-tint text-ink"
                : "border-line bg-white text-sub hover:border-primary-light"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded border ${
                checked ? "border-primary bg-primary" : "border-sub/40 bg-white"
              }`}
            >
              {checked && (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white" fill="none">
                  <path
                    d="M2 6.5l2.5 2.5L10 3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
