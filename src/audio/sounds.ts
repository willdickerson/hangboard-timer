import type { Sound, Sounds } from '../types/workout'

export const sounds: Sounds = {
  begin: new Audio('sounds/begin.mp3') as Sound,
  hang: new Audio('sounds/start.mp3') as Sound,
  rest: new Audio('sounds/stop.mp3') as Sound,
}
