# Draft Plan: Local Network Card Games Suite

## Idea Summary

Build mobile card games that support local and online multiplayer: Rummy, Solitaire, and UNO-like real-time gameplay.

## Problem

Many users want quick social games with low latency and the option to play on local networks without heavy setup.

## Target Users

- Friends and families
- Casual mobile gamers
- Small social groups and hostels

## Core MVP

- Game lobby creation and join by code
- Local Wi-Fi and internet multiplayer support
- Real-time turn sync and game state recovery
- One polished game mode first (UNO-like), then expand

## Game Modes Roadmap

1. UNO-like multiplayer
2. Rummy tables (points and pool variants)
3. Solitaire single-player and challenge mode

## Technical Notes

- WebSocket-based game server
- Deterministic game engine for fair turns
- Anti-cheat checks on server side
- Reconnect and resume support

## Monetization

- Cosmetic themes and card decks
- Optional ads between games
- Premium ad-free plan

## Milestones

1. Multiplayer foundation + lobby
2. UNO-like game launch
3. Add Rummy and leaderboard
4. Add Solitaire and tournaments
