export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    header = "Delete Customer",
    text = "Are you sure you want to delete this customer?"
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    header?: string,
    text?: string
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{header}</h2>
                <p className="text-sm text-gray-600 mb-6">{text}</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                </div>
            </div>
        </div>
    );
};
