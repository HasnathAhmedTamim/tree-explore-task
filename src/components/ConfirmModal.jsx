export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="panel-wrapper max-w-md w-full z-10">
        <div className="px-3 pt-3">
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="mb-4 text-sm text-gray-700">{message}</p>
        </div>
        <div className="px-3 pb-3 flex justify-end gap-2">
          <button className="px-3 py-1 rounded border" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}
