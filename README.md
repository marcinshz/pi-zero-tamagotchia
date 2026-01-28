# Personalized Tamagotchi game

My own take on pet game with offline and online features, meant for two users.
Created for Raspberry pi zero 2w setup with a 320x240px display and four buttons.
Uses assets (images and animations) generated with **Midjourney**. (Assets not included in repo)

## Technologies
- PixiJS
- Zustand
- Supabase
- TypeScript
- Vite

## Pet View
Pet life state (love, hunger, fun), actions (kiss, feed, play) and animations implemented for each action and idle states.

## Play View
Simple game similiar to Chrome Dino.

## Emotions View
Online feature, view where user can send four possible emojis to the other user.

## Received Messages View
Online feature, displays received messages. Works realtime with Supabase subscribe feature.

## Days View
Online feature, displays 2 upcoming events from Supabase db.

## Getting Started

```bash
git clone
cd pi-zero-tamagotchia
npm install
npm run dev
