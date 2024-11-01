import type { XtxGuessInstance } from '@/types/components'

export const useGuessList = () => {
  const guessRef = ref<XtxGuessInstance>()
  const onScrollTolower = () => {
    guessRef.value?.getMore()
  }

  return {
    guessRef,
    onScrollTolower,
  }
}
