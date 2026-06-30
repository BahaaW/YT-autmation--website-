# YouTube Shorts Semi-Automated Production System — Part 1

> Sections 1–5 of 15

---

## 1. SYSTEM SUMMARY

### What the System Is
A laptop-first, semi-automated content production pipeline that discovers viral-potential source clips, scores them for monetization and advertiser safety, transforms them through AI voiceover + substantive editing into original-feeling Shorts, and queues them for your manual final review and upload. You are the editor-in-chief; the system is your production staff.

### Why This Design Fits Your Goals
| Goal | How the System Serves It |
|---|---|
| Monetization safety | Every clip passes a 5-dimension scoring gate before production begins. Unsafe material is rejected at intake, not patched in post. |
| Advertiser-friendly | The editing template enforces clean-first-5-seconds, no profanity, no shock content. AI voiceover replaces risky original audio. |
| One-person operation | Automation handles discovery, scoring, script drafting, voiceover, and caption generation. You handle only curation, final review, and upload. |
| Strong transformation | The mandatory transformation checklist (voiceover + reframe + captions + pacing + editorial structure) ensures every Short passes YouTube's "meaningful original value" bar. |
| Viral potential | Scoring engine weights retention hooks and emotional payoff. The editing template enforces proven viral pacing. |
| Scale later | The architecture separates each stage into independent modules. You can add tools, hire editors, or batch harder without redesigning the system. |

### Core Operating Philosophy
**"Reject early, transform deeply, post manually."**

- Never try to rescue bad source material.
- Never assume light edits are enough.
- Never autopost.
- Treat every Short as if a YouTube reviewer is watching it during your monetization application.
- Prefer 3 strong Shorts over 5 mediocre ones.

---

## 2. CHANNEL FORMAT

### The Repeatable Format Identity
**Format name: "Narrated Spotlight"**

Each Short follows this pattern:
1. A compelling visual moment (source clip, reframed and re-paced)
2. Your AI narrator voice providing commentary, context, or insight
3. Bold animated captions synced to narration
4. Zoom/reframe edits that re-direct viewer attention
5. A clean payoff/conclusion with soft CTA

The viewer experience is: *"I'm watching a produced segment, not someone else's raw clip."*

### How Mixed Sources Feel Consistent
Consistency comes from **format**, not from source material:
- Same narrator voice across all Shorts
- Same caption style (font, color, animation type)
- Same intro pacing pattern (hook within 1.5 seconds)
- Same aspect ratio treatment (always 9:16, always reframed)
- Same audio bed approach (subtle background music or none)
- Same CTA pattern at the end

A viewer should recognize your channel's "feel" whether the source clip is an animal moment, an engineering feat, or a human skill display.

### Why This Format Is Safer for Monetization
| Risk | How the Format Mitigates It |
|---|---|
| Reused content flag | AI voiceover + editorial structure + captions + reframing = clear transformation layer |
| Inauthentic content flag | Consistent narrator voice + editorial perspective = human creative direction |
| Repetitious content flag | Scoring engine rejects templates-only outputs; each Short has a unique script |
| Advertiser safety | Clean voiceover replaces original audio; rejection filter catches unsafe visuals pre-production |
| AI slop detection | Scripts are reviewed before voiceover generation; narration adds genuine editorial value, not filler |

---

## 3. TOOL STACK

### MVP Stack (Cheapest Workable Version — ~$0–30/month)

| Tool | Purpose | Cost | Beginner-Friendly? |
|---|---|---|---|
| **YouTube Shorts feed + Google Trends** | Source discovery (manual browsing in incognito) | Free | ✅ Yes |
| **ChatGPT / Claude** | Clip evaluation, script writing, title/description generation | Free tier or $20/mo | ✅ Yes |
| **CapCut Desktop** | Video editing, auto-captions, zoom/reframe, pacing | Free | ✅ Yes |
| **ElevenLabs Free Tier** | AI voiceover generation | Free (10k chars/mo) | ✅ Yes |
| **Pixabay / YouTube Audio Library** | Royalty-free background music | Free | ✅ Yes |
| **Notepad / Google Sheets** | Tracking pipeline, scores, posting schedule | Free | ✅ Yes |

### Upgraded Stack (~$50–100/month)

| Tool | Purpose | Cost | Why Upgrade? |
|---|---|---|---|
| **Virlo or TubeLab** | Automated trend/viral clip discovery | $15–30/mo | Saves 30+ min/day on discovery |
| **ElevenLabs Starter** | More voiceover characters, better voices, voice consistency | $5–22/mo | No watermark, commercial rights |
| **CapCut Pro** or **DaVinci Resolve** | Advanced editing, more effects, no limitations | Free–$10/mo | DaVinci is free and pro-grade |
| **Kapwing Pro** | Browser-based editing + AI captions + B-roll generation | $16/mo | Good for rapid iteration |
| **Opus Clip** | Auto-detect viral moments in longer source videos | $15/mo | Speeds up clip selection |
| **Notion or Airtable** | Production pipeline tracking with status workflows | Free–$10/mo | Better than spreadsheets at scale |

### Optional Tools (Add When Needed)

| Tool | Purpose | When to Add |
|---|---|---|
| **vidIQ or TubeBuddy** | SEO optimization, title testing | After 50+ Shorts published |
| **Submagic** | Premium animated captions | When caption quality matters more |
| **Descript** | Text-based video editing with built-in voice | If you want an all-in-one workflow |
| **Canva Pro** | Thumbnail/cover frame design | When you want branded cover images |

---

## 4. AUTOMATION ARCHITECTURE

### Full Workflow: Discovery → Upload

```
┌─────────────────────────────────────────────────────┐
│  STAGE 1: DISCOVERY (Semi-Automated)                │
│  ├─ Browse Shorts feed (incognito) — Manual         │
│  ├─ Check Google Trends (YouTube filter) — Manual   │
│  ├─ Use Virlo/TubeLab for outliers — Automated scan │
│  └─ Output: 10–15 candidate clip URLs               │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  STAGE 2: SCORING & FILTERING (AI-Assisted)         │
│  ├─ Paste clip URL + description into AI prompt     │
│  ├─ AI returns 5-score evaluation — Automated       │
│  ├─ You review scores + make go/no-go — Manual      │
│  └─ Output: 4–6 approved clips with scores          │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  STAGE 3: SCRIPT & VOICEOVER (AI-Generated)         │
│  ├─ AI writes narration script per clip — Automated │
│  ├─ You review/edit script — Manual                 │
│  ├─ Generate voiceover via ElevenLabs — Automated   │
│  └─ Output: .mp3 voiceover files + final scripts    │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  STAGE 4: VIDEO EDITING (Semi-Automated)            │
│  ├─ Import source clip + voiceover into CapCut      │
│  ├─ Apply editing template — Semi-Automated         │
│  │   ├─ Auto-captions (CapCut AI)                   │
│  │   ├─ Zoom/reframe keyframes (Manual + presets)   │
│  │   ├─ Pacing cuts (Manual)                        │
│  │   └─ Background music (from library)             │
│  └─ Output: Draft .mp4 Short                        │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  STAGE 5: REVIEW (Manual)                           │
│  ├─ Watch full Short — Manual                       │
│  ├─ Run manual review checklist — Manual            │
│  ├─ AI generates title + description — Automated    │
│  ├─ You approve/edit metadata — Manual              │
│  └─ Output: Final approved Short + metadata         │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  STAGE 6: UPLOAD (Manual — Non-Negotiable)          │
│  ├─ Upload to YouTube manually                      │
│  ├─ Set title, description, tags                    │
│  ├─ Self-certify advertiser-friendliness            │
│  └─ Schedule or publish                             │
└─────────────────────────────────────────────────────┘
```

### Automation Breakdown

| Step | Automation Level | Tool |
|---|---|---|
| Trend discovery | Semi-auto (tool scans, you browse) | Virlo / YouTube feed |
| Clip evaluation | AI-assisted (you paste, AI scores) | ChatGPT / Claude |
| Go/no-go decision | **Manual** | You |
| Script writing | AI-generated (you review) | ChatGPT / Claude |
| Voiceover | Automated | ElevenLabs |
| Video editing | Semi-auto (presets + manual cuts) | CapCut |
| Auto-captions | Automated | CapCut AI |
| Final review | **Manual** | You |
| Title/description | AI-generated (you approve) | ChatGPT / Claude |
| Upload | **Manual** | YouTube Studio |

### How Data Flows
```
Clip URLs → AI Scoring Prompt → Approved List →
Script Prompt → Voiceover Tool → CapCut Timeline →
Exported MP4 → Review Checklist → YouTube Upload
```

All data flows through copy-paste and file transfer. No APIs needed for MVP. No server infrastructure.

### How It Avoids Overcomplication
- No custom code required at MVP
- No API integrations required
- No scheduling bots
- Each stage is independent — if one tool breaks, swap it without redesigning
- The AI prompts are plain text you paste into ChatGPT/Claude

---

## 5. SCORING ENGINE

Every candidate clip must be scored on 5 dimensions before entering production.

### Score Structure

| Dimension | Scale | Weight | Fail Threshold |
|---|---|---|---|
| Monetization Safety | 1–10 | 30% | Below 6 = auto-reject |
| Advertiser Safety | 1–10 | 25% | Below 6 = auto-reject |
| Viral Potential | 1–10 | 20% | Below 4 = skip unless safety is 9+ |
| Transformation Potential | 1–10 | 15% | Below 5 = reject |
| Source Risk | 1–10 | 10% | Below 5 = reject |

**Final Approval Score** = Weighted average. Minimum 6.0 to proceed.

### Dimension Definitions

#### 5A. Monetization Safety Score (Weight: 30%)

Measures: *Will this clip, after transformation, risk a reused-content or inauthentic-content flag?*

| Score | Meaning |
|---|---|
| 9–10 | Source is obscure/niche, easy to transform, no risk of "same video everywhere" |
| 7–8 | Source has moderate exposure, but strong transformation will differentiate |
| 5–6 | Source is widely reposted; transformation must be exceptional to pass |
| 3–4 | Source is extremely viral and already reposted by many channels — high risk |
| 1–2 | Source is copyrighted entertainment, news broadcast, or identical to 100+ reposts |

**Fail condition:** Score below 6. If a clip is already reposted by 10+ channels with minimal editing, reject it regardless of virality.

**High score example:** A dashcam clip from a small subreddit showing an unusual driving maneuver — few reposts, easy to narrate and contextualize.

**Low score example:** A viral celebrity interview clip already reposted by 50 YouTube channels — transformation cannot overcome saturation.

#### 5B. Advertiser Safety Score (Weight: 25%)

Measures: *Will this content, after transformation, trigger limited ads or demonetization?*

| Score | Meaning |
|---|---|
| 9–10 | Fully clean: no violence, profanity, controversy, shock, or sensitive topics |
| 7–8 | Mildly edgy but manageable: mild tension, dramatic moments, no explicit content |
| 5–6 | Contains elements that could trigger yellow icon: mild injury, raised voices, mild controversy |
| 3–4 | Contains clearly problematic elements: visible injury, strong language, sensitive topics |
| 1–2 | Contains hard-reject elements: nudity, graphic violence, hate, drugs |

**Fail condition:** Score below 6. A clip scoring 5 may be reconsidered only if all other scores are 8+.

**High score example:** A skilled craftsman making something beautiful — zero controversy, maximum advertiser comfort.

**Low score example:** A street fight that happens to have a spectacular ending — entertaining but advertiser-toxic.

#### 5C. Viral Potential Score (Weight: 20%)

Measures: *Will this Short grab attention, retain viewers, and drive shares?*

| Score | Meaning |
|---|---|
| 9–10 | Jaw-dropping, emotionally compelling, universally interesting, strong hook + payoff |
| 7–8 | Very engaging, clear hook, satisfying conclusion, broad appeal |
| 5–6 | Interesting to a niche, decent hook, but may not hold general audience |
| 3–4 | Mildly interesting, weak hook, no clear payoff |
| 1–2 | Boring, confusing, or only interesting with heavy context |

**Fail condition:** Score below 4, unless monetization and advertiser scores are both 9+. (Safe but boring clips can be used as "filler" if the channel needs consistency.)

**High score example:** A dog solving an impossible puzzle — universal appeal, strong emotional hook, satisfying payoff.

**Low score example:** Someone explaining a niche tax regulation — important but zero viral mechanics.

#### 5D. Transformation Potential Score (Weight: 15%)

Measures: *Can I add meaningful editorial value that makes this Short clearly "mine"?*

| Score | Meaning |
|---|---|
| 9–10 | Rich narration opportunity: backstory, context, analysis, humor, insight — the clip needs a narrator |
| 7–8 | Good narration fit: can add context, explain, or enhance the clip meaningfully |
| 5–6 | Narration is possible but thin — the clip mostly speaks for itself |
| 3–4 | Hard to add value — the clip is self-explanatory and narration would feel forced |
| 1–2 | No transformation angle — any narration would be pointless filler |

**Fail condition:** Score below 5. If you can't write a genuine 15–30 second narration script that adds real value, the clip isn't suitable for this format.

**High score example:** A time-lapse of a complex engineering project — perfect for "here's what's actually happening" narration.

**Low score example:** A perfectly timed comedic moment that needs zero explanation — narration would ruin it.

#### 5E. Source Risk Score (Weight: 10%)

Measures: *Is the source itself legally and ethically safe to use as a base?*

| Score | Meaning |
|---|---|
| 9–10 | Source is CC-licensed, from a public domain, or from a creator who encourages sharing |
| 7–8 | Source is user-generated content with no obvious copyright issues |
| 5–6 | Source origin is unclear but content is generic enough to transform safely |
| 3–4 | Source is from a major media company, news network, or entertainment studio |
| 1–2 | Source is clearly copyrighted with active enforcement (movie clips, music videos, TV shows) |

**Fail condition:** Score below 5.

### Final Approval Score Calculation

```
Final = (Monetization × 0.30) + (Advertiser × 0.25) + (Viral × 0.20) +
        (Transformation × 0.15) + (Source Risk × 0.10)
```

| Final Score | Decision |
|---|---|
| 7.5+ | **Green light** — prioritize production |
| 6.0–7.4 | **Proceed with caution** — extra review at final check |
| 5.0–5.9 | **Hold** — only produce if pipeline is short and all fail conditions pass |
| Below 5.0 | **Reject** — do not produce |

**Hard rejection override:** Any single dimension below its fail threshold = automatic reject regardless of final score.
