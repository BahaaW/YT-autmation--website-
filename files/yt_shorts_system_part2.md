# YouTube Shorts Semi-Automated Production System — Part 2

> Sections 6–9 of 15

---

## 6. SOURCE FILTER RULES

### Hard Rejection Rules (Instant No)

Any clip matching **any** of these is rejected immediately — no exceptions, no "maybe with editing":

| # | Rule | Reason |
|---|---|---|
| 1 | Religion as the main topic or hook | Advertiser poison + controversy magnet |
| 2 | Nudity or sexually suggestive visuals | Community Guidelines strike risk |
| 3 | Visible injury, blood, or graphic harm | Demonetization + viewer reports |
| 4 | Heavy profanity in first 10 seconds of source | Even with replacement audio, visual context may trigger flags |
| 5 | Hate speech, slurs, discriminatory content | Channel termination risk |
| 6 | Active tragedy, disaster footage, mass suffering | Advertiser flight + sensitive events policy |
| 7 | Partisan political content or hot-button news | Advertiser avoidance + controversy |
| 8 | Scams, illegal activity, drug use, dangerous stunts | Community Guidelines violation |
| 9 | Copyrighted entertainment (movie/TV/music video clips) | Copyright strike risk |
| 10 | Content already reposted by 10+ channels with minimal editing | Reused content flag guaranteed |
| 11 | Content featuring identifiable minors in risky/embarrassing situations | Child safety policy |
| 12 | Weapons as the primary focus or appeal | Advertiser-unfriendly |

### Borderline Case Handling

For clips that don't trigger hard rejection but feel "iffy":

**The 3-Question Test:**
1. "Would I be comfortable if a YouTube reviewer watched this during my monetization application?" → If no, reject.
2. "Would Coca-Cola or Disney run an ad before this?" → If no, reject.
3. "Can I write a genuine 20-second narration script that adds real value?" → If no, reject.

If all three answers are "yes," proceed to scoring. If any answer is "no," reject.

### Viral But Risky Clips

**Rule: Virality does not override safety.**

When a clip is clearly viral but carries risk:
1. Score it normally through the scoring engine
2. If any safety score is below 6, reject it — period
3. If safety scores are 6–7 (borderline), ask: "Is there a safer version of this concept I could find instead?"
4. Never rationalize risk with "but it'll get views"
5. Log the rejected clip and the reason — this builds your instinct over time

### Safe But Weak Clips

When a clip is perfectly safe but has low viral potential:
1. If viral score is 3 or below and you have better options, skip it
2. If viral score is 4–5 and your pipeline is short for the day, you may produce it
3. Never produce more than 1 "safe but weak" Short per day
4. Use safe-but-weak clips to test narration styles or editing techniques
5. If your channel is new (under 500 subs), prioritize safe+decent over risky+viral

---

## 7. EDITING TEMPLATE

### Default Transformation Template: "Narrated Spotlight"

Every Short follows this structure unless you deliberately vary it (max 1 variation per day).

#### Hook Structure (0:00–0:03)

- **Visual:** The most visually compelling 1–2 seconds of the clip, reframed tight (crop to action)
- **Audio:** Narrator delivers a 5–10 word hook line
- **Caption:** Hook line appears as large, bold, centered text
- **Examples of good hooks:**
  - "This engineer solved a 40-year-old problem."
  - "Nobody expected what happened next."
  - "Watch how fast this changes everything."
- **What NOT to do:** No "Wait for it…", no meme sounds, no "OMG you won't believe…", no clickbait-bait

#### Timing Structure

| Segment | Duration | Purpose |
|---|---|---|
| Hook | 0:00–0:03 | Grab attention, establish premise |
| Setup | 0:03–0:10 | Context via narration — what are we watching and why it matters |
| Development | 0:10–0:35 | The main action/story unfolds with narration layered over |
| Payoff | 0:35–0:50 | The satisfying conclusion, result, or reveal |
| CTA | 0:50–0:55 | Soft call-to-action |
| **Total** | **35–58 sec** | **Target 45 seconds as default** |

#### Voiceover Style

- **Tone:** Confident, clear, slightly energetic but not hyper. Think "smart friend explaining something cool."
- **Pace:** 140–160 words per minute (slightly faster than conversational)
- **Personality:** Authoritative but approachable. No yelling, no whispering, no sarcasm.
- **Language:** Simple vocabulary, short sentences, active voice. Max 2 clauses per sentence.
- **Voice selection:** Choose one consistent ElevenLabs voice and use it for ALL Shorts. This becomes your channel identity.
- **What NOT to do:** No vocal fry, no dramatic pauses longer than 0.5s, no "Hey guys," no "Smash that subscribe button"

#### Caption Style

- **Font:** Bold sans-serif (CapCut default "Bold" or similar)
- **Color:** White text with black outline/shadow (maximum readability)
- **Position:** Lower-center third of screen (avoids overlapping with YouTube UI)
- **Animation:** Word-by-word or phrase-by-phrase pop-in (CapCut auto-caption default)
- **Size:** Large enough to read on a phone without squinting
- **Highlight:** Key words highlighted in a brand color (pick one: yellow, cyan, or orange)
- **What NOT to do:** No all-caps for entire sentences, no rainbow colors, no cursive fonts, no tiny text

#### Zoom/Reframe Style

- **Minimum:** 3 zoom/reframe changes per Short
- **Types:**
  - Slow push-in during dramatic moments (2–3 seconds, 110–120% zoom)
  - Quick snap-zoom on impact moments (0.3 seconds, 130% zoom)
  - Pan/reframe to follow action within the source clip
  - Crop to face during reaction moments
- **Purpose:** Each zoom must serve a purpose — directing attention, creating emphasis, or improving composition
- **What NOT to do:** No random zooms, no constant zooming (creates motion sickness), no zooms that crop out the key action

#### Pacing Logic

- **Cut frequency:** Minimum 1 visual change every 3–4 seconds
- **Visual changes include:** cuts, zooms, reframes, caption animations, B-roll inserts
- **Dead air:** Maximum 1 second of silence at any point
- **Momentum:** Pacing should accelerate slightly toward the payoff
- **Music:** Optional subtle background music at 10–15% volume (never competing with narration)
- **What NOT to do:** No jump cuts that break continuity, no jarring transitions, no strobe effects

#### CTA Style

- **Approach:** Soft and earned, not begging
- **Examples:**
  - "Follow for more like this." (text overlay, no voiceover)
  - Brief end card with channel name
  - "Part 2?" (only if there's a genuine part 2)
- **What NOT to do:** No "Subscribe and hit the bell!", no "Like if you agree!", no pop-up subscribe animations

#### What MUST Change from Source to Final

| Element | Source | Final Output |
|---|---|---|
| Audio | Original audio (often noisy, includes music, voices) | AI voiceover narration + optional royalty-free music |
| Framing | Original aspect ratio and framing | Reframed for 9:16 with intentional crop/zoom choices |
| Pacing | Source's natural pacing (often too slow or too fast) | Re-paced with cuts to match viral timing template |
| Text | No captions | Full animated captions synced to narration |
| Structure | Raw footage with no editorial arc | Hook → Setup → Development → Payoff → CTA |
| Context | None (viewer must figure it out) | Narrator provides context, backstory, or insight |
| Length | Variable (may be 10s or 5min) | Trimmed/edited to 35–58 seconds |

#### What Must NEVER Be Included

- Original audio with copyrighted music (replace entirely)
- Watermarks from other platforms (TikTok, Instagram, etc.)
- Other channels' branding or logos
- Meme sound effects
- Shock/gore even if brief
- Content that could identify and embarrass private individuals
- Misleading narration that fabricates false context

---

## 8. DAILY SOP (Standard Operating Procedure)

### Target: 3–5 Shorts per day | Total daily time: 2.5–4 hours

---

### Morning Workflow (30–45 min) — DISCOVERY

**Time:** First thing in your work block

| Step | Action | Time |
|---|---|---|
| 1 | Open YouTube in incognito. Browse Shorts feed for 15 min. Save promising clip URLs to a note. | 15 min |
| 2 | Check Google Trends → YouTube Search filter. Note any rising topics. | 5 min |
| 3 | (If using Virlo/TubeLab) Check trending/outlier dashboard. Add to candidate list. | 5–10 min |
| 4 | Check your saved/bookmarked "watch later" viral clips from previous days. | 5 min |
| **Output** | **10–15 candidate clip URLs in a note** | **30–45 min** |

---

### Selection Workflow (20–30 min) — SCORING

| Step | Action | Time |
|---|---|---|
| 1 | For each candidate, watch the full clip and note what it's about. | 10 min |
| 2 | Paste each clip's description into the AI scoring prompt (see Prompt Pack). Get scores. | 5–10 min |
| 3 | Review scores. Apply hard-rejection rules. Remove anything below 6.0 final score. | 5 min |
| 4 | Rank remaining clips by final score. Select top 4–6 for production. | 2 min |
| **Output** | **4–6 approved clips ranked by priority** | **20–30 min** |

---

### Production Workflow (60–120 min) — THE CORE

**Per Short (15–25 min each × 4–5 Shorts):**

| Step | Action | Time |
|---|---|---|
| 1 | Paste clip context into script prompt (see Prompt Pack). Get narration draft. | 2 min |
| 2 | Review/edit the script. Ensure it adds real value and feels natural. | 3 min |
| 3 | Paste final script into ElevenLabs. Generate voiceover. Download .mp3. | 2 min |
| 4 | Open CapCut. Import source clip + voiceover. | 1 min |
| 5 | Apply editing template: reframe for 9:16, sync voiceover, add zoom keyframes. | 5–8 min |
| 6 | Generate auto-captions (CapCut AI). Adjust styling to match template. | 2–3 min |
| 7 | Add background music if needed (10–15% volume). | 1 min |
| 8 | Export draft .mp4. | 1 min |
| **Output per Short** | **Draft .mp4 ready for review** | **15–25 min** |

**Batching tip:** Do all scripts first (batch), then all voiceovers (batch), then all edits (batch). This is faster than doing one Short end-to-end at a time.

---

### Review Workflow (15–25 min) — QUALITY GATE

| Step | Action | Time |
|---|---|---|
| 1 | Watch each draft Short fully on your phone (test mobile experience). | 2 min/Short |
| 2 | Run the Manual Review Checklist (Section 13) for each. | 2 min/Short |
| 3 | Fix any issues found (re-edit, re-export). | 3–5 min if needed |
| 4 | Paste clip context into title/description prompt (see Prompt Pack). | 1 min/Short |
| 5 | Review/edit generated titles and descriptions. | 1 min/Short |
| **Output** | **3–5 final-approved Shorts with metadata** | **15–25 min** |

---

### Posting Workflow (10–15 min) — MANUAL UPLOAD

| Step | Action | Time |
|---|---|---|
| 1 | Open YouTube Studio. Upload first Short. | 1 min |
| 2 | Set title, description, tags. Self-certify as advertiser-friendly. | 2 min |
| 3 | Set schedule (space Shorts 3–4 hours apart throughout the day). | 1 min |
| 4 | Repeat for remaining Shorts. | 2 min each |
| **Output** | **3–5 Shorts scheduled/published** | **10–15 min** |

---

### Daily Time Summary

| Phase | Time Range |
|---|---|
| Discovery | 30–45 min |
| Scoring/Selection | 20–30 min |
| Production (batch) | 60–120 min |
| Review | 15–25 min |
| Posting | 10–15 min |
| **Total** | **2h 15min – 4h** |

---

## 9. PROMPT PACK

### Prompt 1: Source Clip Evaluation

```
You are a YouTube Shorts content evaluator. Your job is to score a candidate
source clip for a semi-automated Shorts production channel.

The channel format is "Narrated Spotlight" — each Short uses source clips
transformed with AI voiceover commentary, bold captions, zoom/reframe edits,
and re-paced editing. Final Shorts must feel clearly produced, not reposted.

CLIP DESCRIPTION:
[Paste: what happens in the clip, where it's from, approximate length,
any notable elements]

CLIP URL (if available): [paste URL]

Score this clip on these 5 dimensions (1-10 scale):

1. MONETIZATION SAFETY (weight 30%)
   How likely is this clip, after transformation, to pass YouTube's
   reused-content and inauthentic-content review?
   - 9-10: Obscure source, easy to transform, not widely reposted
   - 5-6: Widely shared, requires exceptional transformation
   - 1-4: Saturated reposts or copyrighted entertainment

2. ADVERTISER SAFETY (weight 25%)
   How advertiser-friendly is this content?
   - 9-10: Fully clean, zero controversial elements
   - 5-6: Contains mild edgy elements
   - 1-4: Contains violence, profanity, controversy, or sensitive content

3. VIRAL POTENTIAL (weight 20%)
   How likely is this to grab attention, retain viewers, and get shares?
   - 9-10: Jaw-dropping, universal appeal, strong hook and payoff
   - 5-6: Niche-interesting, decent hook
   - 1-4: Boring, confusing, or requires heavy context

4. TRANSFORMATION POTENTIAL (weight 15%)
   Can meaningful narration, context, or editorial insight be added?
   - 9-10: Rich narration opportunity — backstory, explanation, insight
   - 5-6: Some narration possible but thin
   - 1-4: Self-explanatory, narration would feel forced

5. SOURCE RISK (weight 10%)
   Is the source legally and ethically safe to use as a base?
   - 9-10: Public domain, CC-licensed, or creator encourages sharing
   - 5-6: User-generated, origin unclear but generic
   - 1-4: Major media company, news network, active copyright enforcement

HARD REJECTION CHECK — Does this clip contain ANY of these?
- Religion as main topic
- Nudity/sexual content
- Graphic injury/blood
- Heavy profanity in first 10 seconds
- Hate speech/discrimination
- Active tragedy/disaster
- Partisan politics/hot-button news
- Scams/illegal activity/drugs/weapons focus
- Copyrighted entertainment (movie/TV/music clips)
- Already reposted by 10+ channels
- Minors in risky/embarrassing situations

OUTPUT FORMAT:
- Hard Rejection: [YES/NO + reason if yes]
- Monetization Safety: [score]/10 — [one-line reason]
- Advertiser Safety: [score]/10 — [one-line reason]
- Viral Potential: [score]/10 — [one-line reason]
- Transformation Potential: [score]/10 — [one-line reason]
- Source Risk: [score]/10 — [one-line reason]
- Final Weighted Score: [calculated score]/10
- Recommendation: [GREEN LIGHT / PROCEED WITH CAUTION / HOLD / REJECT]
- Notes: [any warnings or suggestions]
```

### Prompt 2: Monetization Safety Deep Review

```
You are a YouTube monetization policy expert. Review this Short concept for
monetization safety.

CLIP CONCEPT: [describe the clip and how you plan to transform it]
TRANSFORMATION PLAN: [describe voiceover angle, editing approach, what
you'll add]

Evaluate against these YouTube policies:
1. Reused content policy — Is the transformation meaningful enough?
2. Inauthentic content policy — Does this feel human-directed or
   mass-produced?
3. Repetitious content — Is this too similar to something already
   saturating the platform?

For each policy, answer:
- Risk level: LOW / MEDIUM / HIGH
- Specific concern (if any)
- How to reduce risk (if medium)

Final verdict: SAFE TO PRODUCE / NEEDS MORE TRANSFORMATION / DO NOT PRODUCE
```

### Prompt 3: Viral Potential Review

```
You are a YouTube Shorts viral content analyst. Evaluate this clip's viral
mechanics.

CLIP DESCRIPTION: [what happens]
TARGET AUDIENCE: General / broad appeal
FORMAT: 45-second narrated Short with bold captions and zoom edits

Evaluate:
1. HOOK STRENGTH (1-10): Does the first 2 seconds grab attention?
2. CURIOSITY GAP (1-10): Does the viewer want to see what happens next?
3. EMOTIONAL PAYOFF (1-10): Is the ending satisfying, surprising, or
   moving?
4. SHAREABILITY (1-10): Would someone send this to a friend?
5. REPLAY VALUE (1-10): Would someone watch this twice?
6. UNIVERSALITY (1-10): Does this work across cultures and demographics?

Provide:
- Overall viral score: [average]/10
- Strongest viral mechanic: [which one and why]
- Weakest viral mechanic: [which one and how to improve]
- Suggested hook line for the narration: [5-10 words]
```

### Prompt 4: Voiceover Script Generation

```
Write a narration script for a YouTube Short.

FORMAT: "Narrated Spotlight" — confident, clear AI narrator providing
commentary over a visual clip.

CLIP DESCRIPTION: [describe exactly what happens in the clip, in order]

REQUIREMENTS:
- Total length: 80-130 words (will be spoken at ~150 words/minute over
  a 35-55 second Short)
- Start with a 5-10 word hook line that creates instant curiosity
- Provide context the viewer wouldn't know just from watching
- Add insight, explanation, or a surprising fact
- End with a satisfying conclusion or thought-provoking statement
- Use simple vocabulary, short sentences, active voice
- No questions to the viewer
- No "Hey guys" or "What's up"
- No "smash subscribe" or "like and share"
- No meme references
- Tone: confident, slightly energetic, like a smart friend explaining
  something cool
- Must feel like genuine editorial commentary, not filler narration

OUTPUT: Just the script, nothing else. No stage directions, no
timestamps, no notes. Just the words the narrator will speak.
```

### Prompt 5: Caption Generation / Review

```
Review this voiceover script for caption readability.

SCRIPT:
[paste the voiceover script]

Check:
1. Are all sentences short enough to display as 2-3 word caption
   phrases? (Max 5 words per caption card)
2. Are there any words that are hard to read quickly on a phone screen?
3. Are there natural pause points where captions should break?

OUTPUT:
- Revised script with "/" marks showing where captions should break
- List any words to simplify for on-screen readability
- Suggested highlight words (1-2 per sentence, the most impactful word)
```

### Prompt 6: Final Edit Instructions

```
Generate editing instructions for this YouTube Short.

VOICEOVER SCRIPT:
[paste script]

CLIP DESCRIPTION:
[describe the visual content]

Generate a beat-by-beat editing guide:
- When to cut/zoom (matched to script timing)
- Where to place zoom-ins (which words/moments)
- Where to add snap-zooms vs slow push-ins
- Suggested reframe points
- Music suggestion: yes/no, mood if yes
- Any B-roll or visual variation suggestions

FORMAT: Simple numbered list of editing actions in chronological order.
```

### Prompt 7: Title / Description Generation

```
Generate YouTube Shorts metadata for this video.

SHORT DESCRIPTION: [1-2 sentence summary of what the Short shows]
NARRATION ANGLE: [what perspective/insight the voiceover provides]

Generate:
1. TITLE OPTIONS (3 options):
   - Must be under 70 characters
   - Must create curiosity without clickbait
   - No ALL CAPS
   - No misleading claims
   - No "YOU WON'T BELIEVE" style hooks

2. DESCRIPTION (1 option):
   - 2-3 sentences
   - Summarize what the viewer will see
   - Include 1-2 relevant hashtags
   - No links in first line (YouTube truncates)
   - End with a subtle follow prompt

3. TAGS (5-8 relevant tags):
   - Mix of broad and specific
   - No irrelevant trending tags

Be accurate. Never exaggerate what happens in the Short.
```

### Prompt 8: Final Pre-Post Check

```
You are the final quality gate before a YouTube Short is published.
Review this Short's complete package.

TITLE: [paste]
DESCRIPTION: [paste]
VOICEOVER SCRIPT: [paste]
VISUAL DESCRIPTION: [describe what's shown]
SOURCE: [where the clip came from]

CHECK EACH:

1. REUSED CONTENT RISK
   - Is the transformation meaningful? Does the Short feel produced,
     not reposted?
   - Would a YouTube reviewer see clear editorial value added?
   
2. ADVERTISER SAFETY
   - Would a family-friendly brand be comfortable advertising here?
   - Any profanity, violence, controversy, or sensitive content?
   
3. TITLE ACCURACY
   - Does the title accurately represent the content?
   - Any clickbait or misleading elements?
   
4. METADATA QUALITY
   - Is the description accurate and helpful?
   - Are tags relevant and not spammy?
   
5. COPYRIGHT CONCERNS
   - Any copyrighted music, logos, or entertainment content visible?
   - Any platform watermarks (TikTok, Instagram)?

OUTPUT:
- Status: APPROVED / NEEDS FIXES / REJECT
- Issues found (if any): [list]
- Fixes needed (if any): [list]
- Risk level: LOW / MEDIUM / HIGH
```
