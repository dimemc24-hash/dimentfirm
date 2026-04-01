import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ModuleProgress, LessonProgress } from '../types/database'

export function useModuleProgress(userId: string | undefined) {
  const [modules, setModules] = useState<ModuleProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('module_progress')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        setModules((data as ModuleProgress[]) ?? [])
        setLoading(false)
      })
  }, [userId])

  const getModuleStatus = useCallback((moduleId: string) => {
    return modules.find(m => m.module_id === moduleId)?.status ?? 'locked'
  }, [modules])

  return { modules, loading, getModuleStatus }
}

export function useLessonProgress(userId: string | undefined, moduleId: string) {
  const [lessons, setLessons] = useState<LessonProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .then(({ data }) => {
        setLessons((data as LessonProgress[]) ?? [])
        setLoading(false)
      })
  }, [userId, moduleId])

  const getLessonStatus = useCallback((lessonId: string) => {
    return lessons.find(l => l.lesson_id === lessonId)?.status ?? 'not_started'
  }, [lessons])

  return { lessons, loading, getLessonStatus }
}
