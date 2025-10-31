// Composables personalizados para la aplicación de Lotería Día de Muertos
// Este archivo será expandido en las siguientes tareas

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Hook para manejar el estado de carga
 */
export function useLoading() {
  const isLoading = ref(false)

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  return {
    isLoading,
    setLoading
  }
}

/**
 * Hook para manejar temporizadores
 */
export function useTimer() {
  const time = ref(0)
  const isRunning = ref(false)
  let intervalId: number | null = null

  function start() {
    if (!isRunning.value) {
      isRunning.value = true
      intervalId = window.setInterval(() => {
        time.value++
      }, 1000)
    }
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
      isRunning.value = false
    }
  }

  function reset() {
    stop()
    time.value = 0
  }

  onUnmounted(() => {
    stop()
  })

  return {
    time,
    isRunning,
    start,
    stop,
    reset
  }
}