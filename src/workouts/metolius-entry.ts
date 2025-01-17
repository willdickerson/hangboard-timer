import type { Workout } from '../types/workout'
import { calculateWorkoutDuration } from '../utils/time'

const steps = [
  { name: 'Jug: 15s hang', duration: 15, sound: 'hang' as const },
  { name: 'Rest', duration: 45, sound: 'rest' as const },
  { name: 'Round Sloper: 1 pull-up', duration: 10, sound: 'hang' as const },
  { name: 'Rest', duration: 50, sound: 'rest' as const },
  { name: 'Medium Edge: 10s hang', duration: 10, sound: 'hang' as const },
  { name: 'Rest', duration: 50, sound: 'rest' as const },
  {
    name: 'Pocket: 15s hang with 3 shrugs',
    duration: 15,
    sound: 'hang' as const,
  },
  { name: 'Rest', duration: 45, sound: 'rest' as const },
  {
    name: 'Large Edge: 20s hang with 2 pull-ups',
    duration: 20,
    sound: 'hang' as const,
  },
  { name: 'Rest', duration: 40, sound: 'rest' as const },
  { name: 'Round Sloper: 10s hang', duration: 10, sound: 'hang' as const },
  { name: 'Pocket: 5 knee raises', duration: 15, sound: 'hang' as const },
  { name: 'Rest', duration: 35, sound: 'rest' as const },
  { name: 'Large Edge: 4 pull-ups', duration: 20, sound: 'hang' as const },
  { name: 'Rest', duration: 40, sound: 'rest' as const },
  { name: 'Medium Edge: 10s hang', duration: 10, sound: 'hang' as const },
  { name: 'Rest', duration: 50, sound: 'rest' as const },
  { name: 'Jug: 3 pull-ups', duration: 15, sound: 'hang' as const },
  { name: 'Rest', duration: 45, sound: 'rest' as const },
  { name: 'Round Sloper: Max hang', duration: 30, sound: 'hang' as const },
]

export const metoliusEntryWorkout: Workout = {
  id: 'metolius-entry',
  name: 'Metolius Entry',
  description: '10-minute entry level hangboard sequence',
  duration: calculateWorkoutDuration(steps),
  attribution: {
    name: 'Metolius',
    url: 'https://www.metoliusclimbing.com/training_guide_10_min.html',
  },
  steps,
}
