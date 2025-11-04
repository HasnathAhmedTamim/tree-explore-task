import { useEffect, useState, useCallback } from 'react'
import TreeNode from './components/TreeNode'
import Breadcrumb from './components/Breadcrumb'
import Modal from './components/Modal'
import ConfirmModal from './components/ConfirmModal'
import JSONView from './components/JSONView'
import { deleteAtPath, getValueAtPath, addKeyAtPath, renameKeyAtPath } from './utils/tree'

const STORAGE_KEY = 'tree-explorer:data'

const defaultData = {
  auto: {
    driver_types: {
      auto: true,
      img_url: '',
      is_active: true,
      is_open_for_signup: true,
      name: { bn: '', en: '' },
    },
    verify_otp_for_signup: false,
  },
}

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : defaultData
    } catch {
      return defaultData
    }
  })

  const [selectedPath, setSelectedPath] = useState(() => {
    const keys = Object.keys(data)
    return keys.length ? [keys[0]] : []
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // ignore
    }
  }, [data])

  useEffect(() => {
    // ensure selectedPath remains valid after data change
    if (selectedPath.length === 0) return
    const v = getValueAtPath(data, selectedPath)
    if (v === undefined) {
      const keys = Object.keys(data)
      setSelectedPath(keys.length ? [keys[0]] : [])
    }
  }, [data, selectedPath])
  // keyboard navigation: arrow up/down to move between visible nodes, left/right to collapse/expand
  const [collapsedSet, setCollapsedSet] = useState(new Set())

  const toggleCollapse = useCallback((pathKey) => {
    setCollapsedSet((s) => {
      const n = new Set(s)
      if (n.has(pathKey)) n.delete(pathKey)
      else n.add(pathKey)
      return n
    })
  }, [])

  // keyboard navigation: arrow up/down to move between visible nodes, left/right to collapse/expand
  useEffect(() => {
    function flattenVisible(obj, curPath = []) {
      const res = []
      for (const k of Object.keys(obj)) {
        const p = [...curPath, k]
        res.push(p)
        const pathKey = JSON.stringify(p)
        const isCollapsed = collapsedSet.has(pathKey)
        const val = obj[k]
        if (val && typeof val === 'object' && !isCollapsed) {
          res.push(...flattenVisible(val, p))
        }
      }
      return res
    }

    function onKey(e) {
      const active = document.activeElement
      const tag = active?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || active?.isContentEditable) return

      if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) return
      e.preventDefault()
      const list = flattenVisible(data)
      const selKey = JSON.stringify(selectedPath)
      const idx = list.findIndex((p) => JSON.stringify(p) === selKey)
      if (e.key === 'ArrowDown') {
        if (idx < list.length - 1) setSelectedPath(list[idx + 1])
      } else if (e.key === 'ArrowUp') {
        if (idx > 0) setSelectedPath(list[idx - 1])
      } else if (e.key === 'ArrowRight') {
        // expand or go to first child
        const val = getValueAtPath(data, selectedPath)
        const pathKey = JSON.stringify(selectedPath)
        if (val && typeof val === 'object') {
          if (collapsedSet.has(pathKey)) {
            // expand
            toggleCollapse(pathKey)
          } else {
            // go to first child
            const keys = Object.keys(val)
            if (keys.length) setSelectedPath([...selectedPath, keys[0]])
          }
        }
      } else if (e.key === 'ArrowLeft') {
        const pathKey = JSON.stringify(selectedPath)
        if (!collapsedSet.has(pathKey) && getValueAtPath(data, selectedPath) && typeof getValueAtPath(data, selectedPath) === 'object') {
          // collapse
          toggleCollapse(pathKey)
        } else if (selectedPath.length > 1) {
          setSelectedPath(selectedPath.slice(0, -1))
        }
      } else if (e.key === 'Enter') {
        const val = getValueAtPath(data, selectedPath)
        const pathKey = JSON.stringify(selectedPath)
        if (val && typeof val === 'object') toggleCollapse(pathKey)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [data, selectedPath, collapsedSet, toggleCollapse])

  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState('')

  // Undo/history
  const [history, setHistory] = useState([])

  const pushHistory = (prev, label) => {
    setHistory((h) => {
      const next = [...h, { data: prev, label }]
      if (next.length > 50) next.shift()
      return next
    })
  }

  const undo = () => {
    setHistory((h) => {
      if (h.length === 0) return h
      const last = h[h.length - 1]
      setData(last.data)
      return h.slice(0, -1)
    })
  }

  const [confirmDelete, setConfirmDelete] = useState(null)

  // Add / Rename modal
  const [modalAction, setModalAction] = useState(null) // { type: 'add'|'rename', path }
  const [modalKeyInput, setModalKeyInput] = useState('')
  const [modalValueInput, setModalValueInput] = useState('')

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText)
      pushHistory(data, 'import')
      setData(parsed)
      setShowImport(false)
      setImportText('')
      setImportError('')
    } catch (e) {
      setImportError(e.message)
    }
  }

  function handleSelect(path) {
    setSelectedPath(path)
  }

  function requestDelete(path) {
    if (path.length === 1) return // root cannot be deleted
    setConfirmDelete(path)
  }

  function performDelete() {
    if (!confirmDelete) return
    try {
      pushHistory(data, 'delete')
      const next = deleteAtPath(data, confirmDelete)
      setData(next)
      setConfirmDelete(null)
    } catch {
      // show error (not implemented)
      setConfirmDelete(null)
    }
  }

  function handleAddRequest(path) {
    setModalAction({ type: 'add', path })
    setModalKeyInput('')
    setModalValueInput('')
  }

  function handleRenameRequest(path) {
    setModalAction({ type: 'rename', path })
    const currentKey = path[path.length - 1] || ''
    setModalKeyInput(currentKey)
  }

  function performModalAction() {
    if (!modalAction) return
    if (modalAction.type === 'add') {
      // add key under modalAction.path
      const parentPath = modalAction.path || []
      const key = modalKeyInput.trim()
      if (!key) return
      let value
      try {
        value = modalValueInput ? JSON.parse(modalValueInput) : ''
      } catch {
        value = modalValueInput
      }
  pushHistory(data, 'add')
  const next = addKeyAtPath(data, parentPath, key, value)
  setData(next)
  // select the newly added node
  setSelectedPath([...parentPath, key])
  setModalAction(null)
    } else if (modalAction.type === 'rename') {
      const path = modalAction.path
      const newKey = modalKeyInput.trim()
      if (!newKey) return
      pushHistory(data, 'rename')
      const next = renameKeyAtPath(data, path, newKey)
      setData(next)
      // update selected path if it pointed to the renamed node
      if (JSON.stringify(selectedPath) === JSON.stringify(path)) {
        setSelectedPath([...path.slice(0, -1), newKey])
      }
      setModalAction(null)
    }
  }

  const topKeys = Object.keys(data)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">

      {/* top navbar with actions on the right */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">Tree Explorer</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 md:px-3 md:py-1 bg-blue-600 text-white rounded text-sm md:text-base" onClick={() => setShowImport(true)}>Import</button>
            <button className="px-2 py-1 md:px-3 md:py-1 border rounded text-sm md:text-base" onClick={() => { pushHistory(data, 'reset'); localStorage.removeItem(STORAGE_KEY); setData(defaultData) }}>Reset</button>
            <button className="px-2 py-1 md:px-3 md:py-1 border rounded text-sm md:text-base" onClick={undo} disabled={history.length===0}>Undo</button>
            <button className="px-2 py-1 md:px-3 md:py-1 border rounded text-sm md:text-base" onClick={() => { setModalAction({ type: 'add', path: [] }); setModalKeyInput(''); setModalValueInput('') }}>Add Root</button>
          </div>
        </div>
      </header>

  <div className="max-w-7xl mx-auto px-4 py-6">
    {/* grid: sidebar (min 18rem up to 24rem) + main flexible area */}
  <div className="grid grid-cols-1 lg:grid-cols-[minmax(18rem,24rem)_1fr] gap-8 items-start">
      <aside className="w-full p-4 min-w-0 overflow-auto">
        <div className="tree-card p-4">
          <div className="flex items-center justify-start mb-4">
            <h2 className="text-xl font-semibold">Tree</h2>
          </div>

          <div className="overflow-auto" style={{ maxHeight: '70vh' }}>
            {topKeys.map((k) => (
              <div key={k} className="mb-3">
                <TreeNode
                  name={k}
                  value={data[k]}
                  path={[k]}
                  selectedPath={selectedPath}
                  onSelect={handleSelect}
                  onToggle={toggleCollapse}
                  collapsedSet={collapsedSet}
                  onRequestDelete={requestDelete}
                  onRequestAdd={handleAddRequest}
                  onRequestRename={handleRenameRequest}
                />
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-6">
        <div className="mb-4">
          <Breadcrumb path={selectedPath} onNavigate={setSelectedPath} />
        </div>

        <div className="max-w-5xl mx-auto w-full">
          <div className="panel-wrapper flex flex-col min-h-[40vh]">
            <h3 className="mb-2 font-medium">Full Object</h3>
            <div className="dashed-panel flex-1 overflow-auto p-4">
              <JSONView data={data} />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

      {showImport && (
        <Modal title="Import JSON" onClose={() => setShowImport(false)}>
          <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={10} className="w-full p-2 border rounded bg-white text-black" />
          {importError && <p className="text-red-600 mt-2">{importError}</p>}
          <div className="mt-3 flex justify-end gap-2">
            <button className="px-3 py-1 border rounded" onClick={() => setShowImport(false)}>Cancel</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={handleImport}>Import</button>
          </div>
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Confirm Delete"
          message={`Delete node ${confirmDelete[confirmDelete.length - 1]}? This cannot be undone.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={performDelete}
        />
      )}

      {modalAction && (
        <Modal title={modalAction.type === 'add' ? 'Add node' : 'Rename node'} onClose={() => setModalAction(null)}>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Key</label>
            <input className="w-full p-2 border rounded" value={modalKeyInput} onChange={(e) => setModalKeyInput(e.target.value)} />
          </div>
          {modalAction.type === 'add' && (
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Value (JSON or plain)</label>
              <textarea rows={4} className="w-full p-2 border rounded" value={modalValueInput} onChange={(e) => setModalValueInput(e.target.value)} />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button className="px-3 py-1 border rounded" onClick={() => setModalAction(null)}>Cancel</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={performModalAction}>{modalAction.type === 'add' ? 'Add' : 'Rename'}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
