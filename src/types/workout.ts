export type SoundType = 'begin' | 'hang' | 'rest'

export interface WorkoutStep {
  name: string
  duration: number
  sound: SoundType
}

export interface Sound extends HTMLAudioElement {
  muted: boolean
}

export interface Sounds {
  [key: string]: Sound
  begin: Sound
  hang: Sound
  rest: Sound
}

export interface WorkoutPreviewProps {
  steps: readonly WorkoutStep[]
  currentStep: number
  isExpanded: boolean
  onToggle: () => void
  isDark: boolean
  workoutName: string
}
