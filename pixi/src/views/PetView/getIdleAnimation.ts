import { lifeStore } from "../../states/LifeState.ts";
import { Animations } from "../../states/AnimationState.ts";

export function getIdleAnimation(): Animations {
  const lifeState = lifeStore.getState();

  const isHungry = lifeState.food <= 25;
  const isLonely = lifeState.love <= 25;
  const isBored = lifeState.fun <= 25;

  const possibleIdleAnimations: Animations[] = [];

  if (isHungry) possibleIdleAnimations.push(Animations.HUNGRY);
  if (isLonely) possibleIdleAnimations.push(Animations.LONELY);
  if (isBored) possibleIdleAnimations.push(Animations.BORED);

  const defaultIdleAnimations: Animations[] = [
    Animations.IDLE,
    Animations.DANCE,
    Animations.HOBBY,
  ];

  if (!possibleIdleAnimations.length)
    return defaultIdleAnimations[
      Math.floor(Math.random() * defaultIdleAnimations.length)
    ];

  return possibleIdleAnimations[
    Math.floor(Math.random() * possibleIdleAnimations.length)
  ];
}
