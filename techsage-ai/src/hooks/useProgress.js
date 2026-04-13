// useProgress.js — tracks achievements and stats across sessions via sessionStorage
import { useState, useCallback } from 'react'
import achievementsDef from '../data/achievements.json'

const KEY = 'techsage_progress'

function loadProgress() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{}')
  } catch { return {} }
}

function saveProgress(p) {
  try { sessionStorage.setItem(KEY, JSON.stringify(p)) } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState(() => loadProgress())

  const increment = useCallback((trigger) => {
    setProgress(prev => {
      const next = { ...prev, [trigger]: (prev[trigger] || 0) + 1 }
      saveProgress(next)
      return next
    })
  }, [])

  const set = useCallback((trigger, value) => {
    setProgress(prev => {
      const next = { ...prev, [trigger]: value }
      saveProgress(next)
      return next
    })
  }, [])

  // Returns newly unlocked achievements given current progress
  const checkUnlocks = useCallback((trigger, newCount) => {
    const prev = progress[trigger] || 0
    return achievementsDef.filter(a =>
      a.trigger === trigger &&
      prev < a.threshold &&
      newCount >= a.threshold
    )
  }, [progress])

  const earned = achievementsDef.filter(a =>
    (progress[a.trigger] || 0) >= a.threshold
  )

  return { progress, increment, set, checkUnlocks, earned, allAchievements: achievementsDef }
}
