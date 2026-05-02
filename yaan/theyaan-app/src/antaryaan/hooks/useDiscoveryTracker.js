import { useState, useCallback, useRef, useMemo } from 'react'

/**
 * Tracks "eureka" discoveries the learner makes during simulations.
 *
 * Each discovery has a `check` function that is evaluated against the current
 * simulation state and trajectory history. Once a discovery triggers, it is
 * permanently marked as discovered for the session and the `onDiscover`
 * callback fires so the UI can show a celebration animation.
 *
 * @param {Object} config
 * @param {Array<{ id: string, label: string, hint: string, check?: string }>} config.definitions
 *   Discovery definitions. Each may include a `check` key that names a function
 *   in `checkFunctions`, or provide an inline `check` function.
 * @param {Object<string, (state: Object, history: Array) => boolean>} [config.checkFunctions]
 *   Named check functions referenced by definitions via the `check` string key.
 * @param {Function} [config.onDiscover] - Callback (id, label) fired when a new discovery is made.
 */
export default function useDiscoveryTracker({
  definitions = [],
  checkFunctions = {},
  onDiscover,
} = {}) {
  // Discovered state keyed by id
  const [discoveredMap, setDiscoveredMap] = useState(() => {
    const map = {}
    for (const def of definitions) {
      map[def.id] = false
    }
    return map
  })

  // Keep callbacks in refs to avoid stale closures
  const onDiscoverRef = useRef(onDiscover)
  onDiscoverRef.current = onDiscover

  const checkFunctionsRef = useRef(checkFunctions)
  checkFunctionsRef.current = checkFunctions

  const definitionsRef = useRef(definitions)
  definitionsRef.current = definitions

  // --- Derived data ---

  const discoveries = useMemo(() => {
    return definitionsRef.current.map((def) => ({
      id: def.id,
      label: def.label,
      hint: def.hint,
      discovered: discoveredMap[def.id] === true,
    }))
  }, [discoveredMap])

  const discoveredCount = useMemo(() => {
    return Object.values(discoveredMap).filter(Boolean).length
  }, [discoveredMap])

  const totalCount = definitionsRef.current.length

  const allDiscovered = discoveredCount === totalCount && totalCount > 0

  // --- Actions ---

  /**
   * Mark a single discovery as found by id.
   */
  const markDiscovered = useCallback(
    (id) => {
      setDiscoveredMap((prev) => {
        if (prev[id] === true) return prev // already discovered
        const next = { ...prev, [id]: true }

        // Find the label for the callback
        const def = definitionsRef.current.find((d) => d.id === id)
        if (def && onDiscoverRef.current) {
          // Fire asynchronously so state update completes first
          queueMicrotask(() => {
            onDiscoverRef.current(id, def.label)
          })
        }

        return next
      })
    },
    []
  )

  /**
   * Evaluate all undiscovered definitions against the current state and history.
   * Any check that returns true will mark the corresponding discovery.
   *
   * @param {Object} state - Current simulation state
   * @param {Array} history - Array of past state snapshots
   */
  const checkAll = useCallback(
    (state, history = []) => {
      const defs = definitionsRef.current
      const fns = checkFunctionsRef.current

      setDiscoveredMap((prev) => {
        let changed = false
        const next = { ...prev }

        for (const def of defs) {
          if (next[def.id] === true) continue // already discovered

          // Resolve the check function
          let checkFn = null
          if (typeof def.check === 'function') {
            checkFn = def.check
          } else if (typeof def.check === 'string' && fns[def.check]) {
            checkFn = fns[def.check]
          }

          if (!checkFn) continue

          try {
            if (checkFn(state, history)) {
              next[def.id] = true
              changed = true

              // Fire callback
              if (onDiscoverRef.current) {
                const label = def.label
                const id = def.id
                queueMicrotask(() => {
                  onDiscoverRef.current(id, label)
                })
              }
            }
          } catch {
            // Silently ignore check errors so one bad check doesn't break the loop
          }
        }

        return changed ? next : prev
      })
    },
    []
  )

  return {
    discoveries,
    discoveredCount,
    totalCount,
    allDiscovered,
    checkAll,
    markDiscovered,
  }
}
