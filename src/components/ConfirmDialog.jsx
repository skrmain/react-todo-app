import { AlertTriangleIcon } from 'lucide-react';

const ConfirmDialog = ({
    open,
    title,
    description,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <button
                type="button"
                className="dialog-backdrop"
                aria-label="Close dialog"
                onClick={onCancel}
            />
            <div className="dialog-panel panel-animate relative z-10 w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-2xl">
                <div className="mb-3 inline-flex rounded-[var(--radius-md)] bg-rose-50 p-2 text-rose-600">
                    <AlertTriangleIcon size={18} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-[var(--radius-md)] border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-[var(--radius-md)] bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
