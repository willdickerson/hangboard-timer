import { daveMacleodWorkout } from './dave-macleod'
import { emilAbrahamssonWorkout } from './emil-abrahamsson'
import type { Workout } from './types'

const workoutsList: Workout[] = [daveMacleodWorkout, emilAbrahamssonWorkout]

export const workouts: Record<string, Workout> = workoutsList.reduce(
  (acc, workout) => ({
    ...acc,
    [workout.id]: workout,
  }),
  {}
)

export type { Workout, WorkoutStep } from './types'
