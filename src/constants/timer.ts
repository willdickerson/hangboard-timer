export const TIMER_STATES = {
  READY: -1,
  COMPLETE: -2,
} as const

export const COUNTDOWN_DURATION = 15 // seconds
export const TIMER_INTERVAL = 1000 // milliseconds

export const MESSAGES = {
  GET_READY: 'Get Ready!',
  WORKOUT_COMPLETE: 'Workout Complete!',
  UNKNOWN_STEP: 'Unknown Step',
} as const
