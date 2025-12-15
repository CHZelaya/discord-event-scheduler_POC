# Discord to Next.js Events Sync Proof of Concept

## Purpose of the Project

A proof of concept project testing to see if Discord Scheduled Events can be used as the source of truth for a community website built with Next.js

## Why build it?

An existing site uses static calendar data. The goal was to determine whether Discord (already heavily used by the community and community leaders) could be the source of truth and drive dynamic updates without introducing a database or a long running, live bot.


## Architecture

- Next.js App Router.
- Server side API route (`/api/events`) fetches Discord Scheduled Events.
- Bot token used only server-side.
- UI renderes normalized, human readable data.
- No Database.
- No Gateway or long standing bot required.

Discord REST access works even though the app is displayed as offline in Discord UI.

## How it works

1. Discord scheduled events are created via Discord UI.
2. Next.js API route fetches events from Discord REST API.
3. Events are normalized and returned as JSON.
4. Home page renders the contents server-side.

## ENV Variables
```env
DISCORD_BOT_TOKEN=...
DISCORD_GUILD_ID=...
```

## Possible Next Steps
- Add Vercel CRON events to fetch fresh data on new events daily.



