import { daveMacleodWorkout } from './dave-macleod'
import { emilAbrahamssonWorkout } from './emil-abrahamsson'
import { metoliusEntryWorkout } from './metolius-entry'
import { metoliusIntermediateWorkout } from './metolius-intermediate'
import { metoliusAdvancedWorkout } from './metolius-advanced'
import type { Workout } from './types'

const workoutsList: Workout[] = [
  daveMacleodWorkout,
  emilAbrahamssonWorkout,
  metoliusEntryWorkout,
  metoliusIntermediateWorkout,
  metoliusAdvancedWorkout,
]

export const workouts: Record<string, Workout> = workoutsList.reduce(
  (acc, workout) => ({
    ...acc,
    [workout.id]: workout,
  }),
  {}
)

export type { Workout, WorkoutStep } from './types'
