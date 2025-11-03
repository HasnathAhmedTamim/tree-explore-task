// small utilities for tree operations
export function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// delete node at path (array of keys). Returns new data or throws if trying to delete root
export function deleteAtPath(data, path) {
  if (!Array.isArray(path) || path.length === 0) return data
  if (path.length === 1) throw new Error('Cannot delete root node')

  const newData = clone(data)
  let cur = newData
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (cur && typeof cur === 'object' && key in cur) {
      cur = cur[key]
    } else {
      return newData
    }
  }
  const lastKey = path[path.length - 1]
  if (cur && typeof cur === 'object' && lastKey in cur) {
    if (Array.isArray(cur)) {
      // if array, remove by index
      const idx = parseInt(lastKey, 10)
      if (!Number.isNaN(idx)) cur.splice(idx, 1)
    } else {
      delete cur[lastKey]
    }
  }
  return newData
}

export function getValueAtPath(data, path) {
  let cur = data
  for (const key of path) {
    if (cur && typeof cur === 'object' && key in cur) cur = cur[key]
    else return undefined
  }
  return cur
}

export function setValueAtPath(data, path, value) {
  const n = clone(data)
  if (!Array.isArray(path) || path.length === 0) {
    // replace root
    return value
  }
  let cur = n
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (!(key in cur) || typeof cur[key] !== 'object') cur[key] = {}
    cur = cur[key]
  }
  cur[path[path.length - 1]] = value
  return n
}

// add a key at the object located by path (path identifies parent). If path empty, add to root
export function addKeyAtPath(data, path, key, value) {
  const n = clone(data)
  let cur = n
  if (Array.isArray(path) && path.length > 0) {
    for (let i = 0; i < path.length; i++) {
      const k = path[i]
      if (!(k in cur) || typeof cur[k] !== 'object') cur[k] = {}
      if (i === path.length - 1) {
        // target parent is cur[k]
        cur = cur[k]
      } else cur = cur[k]
    }
  }
  // now cur is parent object
  if (cur && typeof cur === 'object') {
    cur[key] = value
  }
  return n
}

// rename the last key in path to newKey
export function renameKeyAtPath(data, path, newKey) {
  if (!Array.isArray(path) || path.length === 0) return data
  const n = clone(data)
  if (path.length === 1) {
    const old = path[0]
    if (old === newKey) return n
    if (newKey in n) return n // collision: do nothing
    n[newKey] = n[old]
    delete n[old]
    return n
  }
  let cur = n
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (!(key in cur) || typeof cur[key] !== 'object') return n
    cur = cur[key]
  }
  const last = path[path.length - 1]
  if (!(last in cur)) return n
  if (newKey in cur) return n // collision
  cur[newKey] = cur[last]
  delete cur[last]
  return n
}
