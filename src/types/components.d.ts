import type XtxGuess from '@/components/XtxGuess.vue'
import type XtxSwiper from '@/components/XtxSwiper.vue'

declare module 'vue' {
  export interface GlobalComponents {
    XtxSwiper: typeof XtxSwiper
    XtxGuess: typeof XtxGuess
  }
}

export type XtxGuessInstance = InstanceType<typeof XtxGuess>
