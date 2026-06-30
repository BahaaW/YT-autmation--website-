# YT-automation — Project-Specific Rules

## Core System Guidelines
This project houses the YouTube Shorts Semi-Automated Production System. All scripts, database configurations, and automation workflows must conform to these rules.

## Hard Constraints
1. **No Autoposting:** Final upload and metadata publishing must remain manual.
2. **Laptop-First:** System must run locally or via simple cloud tools (Airtable, n8n, ElevenLabs, CapCut) manageable on a single laptop by one operator.
3. **Deep Transformation:** Raw reposts are strictly banned. Every Short must feature AI voiceover commentary, reframing, bold captions, and original editorial value.
4. **Safety Over Virality:** Reject clips failing safety gates immediately. Never attempt to "fix in edit."

## Scoring Engine Weights
- **Monetization Safety:** 30% (Fail if < 6)
- **Advertiser Safety:** 25% (Fail if < 6)
- **Viral Potential:** 20% (Fail if < 4)
- **Transformation Potential:** 15% (Fail if < 5)
- **Source Risk:** 10% (Fail if < 5)

## Directory Structure
- `files/` — Reference system specs (yt_shorts_system_part1.md, etc.)
- `scripts/` — Future automation scripts (n8n backups, custom scoring engines)
- `scratch/` — Temp scratch files and drafts
