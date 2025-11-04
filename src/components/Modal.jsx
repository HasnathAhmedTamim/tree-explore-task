import { useEffect, useRef } from 'react'

export default function Modal({ title, children, onClose }) {
  const rootRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement
  const node = rootRef.current
  if (!node) return
  // focus first focusable element inside modal (prefer inputs over buttons)
  const focusable = node.querySelector('input, textarea, select, button, [href], [tabindex]:not([tabindex="-1"])')
  if (focusable) focusable.focus()

    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const focusables = Array.from(node.querySelectorAll('input, textarea, select, button, [href], [tabindex]:not([tabindex="-1"])'))
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previouslyFocused.current && previouslyFocused.current.focus) previouslyFocused.current.focus()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div ref={rootRef} role="dialog" aria-modal="true" className="panel-wrapper max-w-2xl w-full z-10">
        <div className="flex items-center justify-between mb-2 px-3">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>✕</button>
        </div>
        <div className="px-3 pb-3">{children}</div>
      </div>
    </div>
  )
}
