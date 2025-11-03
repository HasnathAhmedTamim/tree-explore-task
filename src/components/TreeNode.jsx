import { useMemo } from 'react'
import { FaMinus, FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { IoIosAdd } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'

function Caret({ isOpen }) {
  return isOpen ? (
    <FaAngleDown className="w-3 h-3 inline-block mr-2" aria-hidden />
  ) : (
    <FaAngleUp className="w-3 h-3 inline-block mr-2" aria-hidden />
  )
}

export default function TreeNode({ name, value, path, selectedPath, onSelect, onToggle, collapsedSet, onRequestDelete, onRequestAdd, onRequestRename }) {
  const hasChildren = value && typeof value === 'object' && Object.keys(value).length > 0
  const pathKey = JSON.stringify(path)
  const isOpen = !collapsedSet.has(pathKey)
  const isSelected = JSON.stringify(selectedPath) === pathKey

  const children = useMemo(() => {
    if (!hasChildren) return null
    return Object.keys(value).map((k) => ({ key: k, val: value[k] }))
  }, [value, hasChildren])

  const pathKeyEncoded = encodeURIComponent(JSON.stringify(path))

  return (
    <div className="group relative">
      <div
        role="treeitem"
        aria-expanded={hasChildren ? isOpen : undefined}
        data-path={pathKeyEncoded}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => onSelect(path)}
  className={`flex items-center justify-between px-3 py-2 lg:px-4 lg:py-3 rounded text-sm lg:text-base ${isSelected ? 'bg-white' : 'hover:bg-gray-50'}`}
      >
  <div className="flex items-center min-w-0 flex-1">
          {hasChildren ? (
            <button onClick={(e) => { e.stopPropagation(); onToggle(pathKey) }} className="mr-2 p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300" aria-label="toggle">
              <Caret isOpen={isOpen} />
            </button>
          ) : (
            <span className="w-5 inline-block" />
          )}
          <span
            className="truncate block text-sm lg:text-base lg:whitespace-normal lg:overflow-visible"
            title={name}
            aria-label={name}
            tabIndex={0}
          >
            {name}
          </span>
        </div>
  <div className="flex items-center gap-3 shrink-0 ml-3 lg:ml-4">
          <button
            title="Add child"
            onClick={(e) => { e.stopPropagation(); if (typeof onRequestAdd === 'function') onRequestAdd(path); else console.warn('onRequestAdd not provided for', path) }}
            className="w-4 h-4 lg:w-7 lg:h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300"
          >
            <IoIosAdd className="w-3 h-3 lg:w-3 lg:h-3" aria-hidden />
          </button>
          <button
            title="Rename"
            onClick={(e) => { e.stopPropagation(); if (typeof onRequestRename === 'function') onRequestRename(path); else console.warn('onRequestRename not provided for', path) }}
            className="w-4 h-4 lg:w-7 lg:h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300"
            aria-label={`Rename ${name}`}
          >
            <MdEdit className="w-3 h-3 lg:w-3 lg:h-3" aria-hidden />
          </button>
          <button
            title="Delete node"
            onClick={(e) => { e.stopPropagation(); if (typeof onRequestDelete === 'function') onRequestDelete(path); else console.warn('onRequestDelete not provided for', path) }}
            className="w-4 h-4 lg:w-7 lg:h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-300"
            aria-label={`Delete ${name}`}
          >
            <FaMinus className="w-3 h-3 lg:w-3 lg:h-3" aria-hidden />
          </button>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className="pl-4 mt-2 relative">
          {/* vertical connector */}
          <div className="tree-connector-vertical" />
          {children.map((c) => (
            <div key={c.key} className="relative">
              {/* small horizontal connector */}
              <div className="tree-connector-horz" />
              <TreeNode
                name={c.key}
                value={c.val}
                path={[...path, c.key]}
                selectedPath={selectedPath}
                onSelect={onSelect}
                onToggle={onToggle}
                collapsedSet={collapsedSet}
                onRequestDelete={onRequestDelete}
                onRequestAdd={onRequestAdd}
                onRequestRename={onRequestRename}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
