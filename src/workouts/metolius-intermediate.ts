import type { Workout } from '../types/workout'
import { calculateWorkoutDuration } from '../utils/time'

const steps = [
  {
    name: 'Large Edge: 15s hang + 3 pull-ups',
    duration: 25,
    sound: 'hang' as const,
  },
  { name: 'Rest', duration: 35, sound: 'rest' as const },
  { name: 'Round Sloper: 2 pull-ups', duration: 10, sound: 'hang' as const },
  { name: 'Medium Edge: 20s hang', duration: 20, sound: 'hang' as const },
  { name: 'Rest', duration: 30, sound: 'rest' as const },
  { name: 'Small Edge: 20s hang', duration: 20, sound: 'hang' as const },
  {
    name: 'Pocket: 15s 90° bent arm hang',
    duration: 15,
    sound: 'hang' as const,
  },
  { name: 'Rest', duration: 25, sound: 'rest' as const },
  { name: 'Round Sloper: 30s hang', duration: 30, sound: 'hang' as const },
  { name: 'Rest', duration: 30, sound: 'rest' as const },
  { name: 'Large Edge: 20s hang', duration: 20, sound: 'hang' as const },
  { name: 'Pocket: 4 pull-ups', duration: 20, sound: 'hang' as const },
  { name: 'Rest', duration: 20, sound: 'rest' as const },
  {
    name: 'Jug/Small Edge: 3 offset pulls each arm',
    duration: 30,
    sound: 'hang' as const,
  },
  { name: 'Switch and repeat', duration: 20, sound: 'hang' as const },
  { name: 'Rest', duration: 10, sound: 'rest' as const },
  { name: 'Jug: 15 knee raises', duration: 20, sound: 'hang' as const },
  { name: 'Medium Edge: 15s hang', duration: 15, sound: 'hang' as const },
  { name: 'Rest', duration: 25, sound: 'rest' as const },
  { name: 'Medium Edge: 25s hang', duration: 25, sound: 'hang' as const },
  { name: 'Rest', duration: 35, sound: 'rest' as const },
  { name: 'Round Sloper: 15s hang', duration: 15, sound: 'hang' as const },
  { name: 'Jug: 3 pull-ups', duration: 15, sound: 'hang' as const },
  { name: 'Rest', duration: 30, sound: 'rest' as const },
  { name: 'Round Sloper: Max hang', duration: 30, sound: 'hang' as const },
]

export const metoliusIntermediateWorkout: Workout = {
  id: 'metolius-intermediate',
  name: 'Metolius Intermediate',
  description: '10-minute intermediate hangboard sequence',
  duration: calculateWorkoutDuration(steps),
  attribution: {
    name: 'Metolius',
    url: 'https://www.metoliusclimbing.com/training_guide_10_min.html',
  },
  steps,
}
