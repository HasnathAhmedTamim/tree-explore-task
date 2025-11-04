export default function JSONView({ data }) {
  return (
    <pre className="whitespace-pre-wrap overflow-auto mono-json h-full text-gray-900 text-sm md:text-base">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
