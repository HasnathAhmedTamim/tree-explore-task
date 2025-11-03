export default function Breadcrumb({ path = [], onNavigate }) {
  if (!path || path.length === 0) return null
  return (
    <div className="flex items-center breadcrumb-title text-gray-900 gap-3" style={{ marginBottom: 8 }}>
      {path.map((p, idx) => (
        <span key={idx} className="flex items-center">
          <button
            onClick={() => onNavigate(path.slice(0, idx + 1))}
            className="hover:underline"
          >
            {p}
          </button>
          {idx < path.length - 1 && <span className="mx-3 text-xl text-gray-500">›</span>}
        </span>
      ))}
    </div>
  )
}
