const PanelCard = ({ title, icon: Icon, subtitle, children, className = '' }) => {
    return (
        <section
            className={`w-full rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.6)] backdrop-blur ${className}`}
        >
            <header className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
                    {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
                </div>
                {Icon ? (
                    <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                        <Icon size={18} />
                    </div>
                ) : null}
            </header>
            {children}
        </section>
    );
};

export default PanelCard;
