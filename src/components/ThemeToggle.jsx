import { LaptopIcon, MoonStarIcon, SunIcon } from 'lucide-react';

const OPTIONS = [
    { value: 'system', label: 'System', icon: LaptopIcon },
    { value: 'dark', label: 'Dark', icon: MoonStarIcon },
    { value: 'light', label: 'Light', icon: SunIcon },
];

const ThemeToggle = ({ value, onChange }) => {
    const activeIndex = Math.max(
        0,
        OPTIONS.findIndex((option) => option.value === value),
    );

    return (
        <div
            className="theme-toggle relative inline-grid grid-cols-3 rounded-xl p-1"
            role="radiogroup"
            aria-label="Theme"
        >
            <span
                className="theme-toggle-indicator pointer-events-none absolute bottom-1 top-1 rounded-lg"
                style={{
                    left: '0.25rem',
                    width: 'calc((100% - 0.5rem) / 3)',
                    transform: `translateX(calc(${activeIndex} * 100%))`,
                }}
            />
            {OPTIONS.map((option) => {
                const isActive = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        aria-label={`${option.label} theme`}
                        title={option.label}
                        onClick={() => onChange(option.value)}
                        className={`relative z-10 inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm transition ${
                            isActive
                                ? 'text-[var(--color-text)]'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                        }`}
                    >
                        <option.icon size={16} />
                    </button>
                );
            })}
        </div>
    );
};

export default ThemeToggle;
