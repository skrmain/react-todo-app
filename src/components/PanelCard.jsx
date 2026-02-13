const PanelCard = ({ title, icon: Icon, subtitle, children, className = '' }) => {
    return (
        <section className={`panel-card panel-animate w-full p-5 ${className}`}>
            <header className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
                    {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
                </div>
                {Icon ? (
                    <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-2 text-slate-600">
                        <Icon size={18} />
                    </div>
                ) : null}
            </header>
            {children}
        </section>
    );
};

export default PanelCard;
