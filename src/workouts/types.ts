export interface WorkoutStep {
  name: string
  duration: number
  sound: 'begin' | 'rest' | 'hang'
}

export interface Workout {
  id: string
  name: string
  description: string
  duration: number
  attribution: {
    name: string
    url: string
  }
  steps: WorkoutStep[]
}
