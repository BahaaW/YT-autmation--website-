# YouTube Shorts Semi-Automated Production System — Part 3

> Sections 10–15 of 15

---

## 10. MVP BUILD

### Simplest Possible Version You Can Start Today

**Philosophy:** Get reps before you optimize. Your first 30 Shorts will teach you more than any tool stack.

### Minimum Tools (Total cost: $0–20/month)

| Tool | Cost | Purpose |
|---|---|---|
| YouTube (incognito browsing) | Free | Source discovery |
| ChatGPT Free or Claude Free | Free | Scoring, scripting, metadata |
| ElevenLabs Free | Free (10k chars/mo) | Voiceover (~8–12 Shorts/month at free tier) |
| CapCut Desktop | Free | Video editing, auto-captions |
| YouTube Audio Library | Free | Background music |
| Notepad / Google Sheets | Free | Pipeline tracking |

### MVP Workflow (Manual-Heavy, ~3 hours/day for 3 Shorts)

1. **Discover** (30 min): Browse YouTube Shorts in incognito. Save 8–10 URLs.
2. **Score** (15 min): Watch each clip. Use the scoring prompt in ChatGPT/Claude. Pick top 3.
3. **Script** (15 min): Use the voiceover prompt to generate 3 scripts. Review/edit each.
4. **Voice** (10 min): Paste scripts into ElevenLabs. Download 3 .mp3 files.
5. **Edit** (60–90 min): Open CapCut. For each Short:
   - Import clip + voiceover
   - Reframe to 9:16
   - Add 3–5 zoom keyframes
   - Generate auto-captions, style them
   - Add subtle music if needed
   - Export .mp4
6. **Review** (15 min): Watch each on your phone. Run checklist. Fix issues.
7. **Post** (10 min): Upload to YouTube manually. Set metadata.

### What You Do Manually First (Automate Later)

| Task | MVP (Manual) | Automate Later With |
|---|---|---|
| Finding viral clips | Browsing Shorts feed | Virlo / TubeLab |
| Scoring clips | Pasting into ChatGPT one by one | Custom GPT or workflow |
| Writing scripts | Pasting prompt each time | Saved prompt template + batch processing |
| Tracking pipeline | Notepad / spreadsheet | Notion / Airtable database |
| Scheduling posts | Manual upload | YouTube Studio scheduling (built-in) |

### MVP Success Criteria (Before Upgrading)

Do NOT upgrade your stack until you've hit all of these:
- [ ] Published 30+ Shorts using the MVP workflow
- [ ] Established your narrator voice and caption style
- [ ] Identified your fastest content categories (what's easiest to produce)
- [ ] Can produce 3 Shorts in under 3 hours consistently
- [ ] Have a feel for what scores well vs what to reject
- [ ] No copyright strikes, no community guidelines warnings

---

## 11. ADVANCED BUILD

### When to Upgrade

Upgrade after you've completed the MVP Success Criteria above AND at least one of:
- You're consistently producing 3 Shorts/day and want to push to 5
- You've hit 500+ subscribers and want to optimize for monetization application
- Your bottleneck is discovery or editing speed, not quality

### Advanced Tool Stack (~$50–100/month)

| Tool | Purpose | Monthly Cost | Time Saved |
|---|---|---|---|
| ElevenLabs Starter | Unlimited voiceover, commercial license, voice cloning | $5–22 | Removes free tier limit |
| Virlo or TubeLab | Automated viral clip discovery + competitor analysis | $15–30 | 20–30 min/day |
| Notion (Free tier) | Production pipeline database with status tracking | $0 | 10 min/day on organization |
| DaVinci Resolve | Professional editing (replaces CapCut if you need more control) | Free | Better quality output |
| vidIQ | SEO optimization for titles, tags, and thumbnails | $7–10 | Better discoverability |

### Advanced Automation Additions

#### A. Custom GPT / Claude Project

Create a saved prompt workspace that includes:
- All 8 prompts from the Prompt Pack pre-loaded
- Your channel's voice guidelines
- Your rejection criteria
- Examples of approved vs rejected clips
- One-click scoring workflow (paste URL → get full evaluation)

**Time saved:** 10–15 min/day on prompt setup.

#### B. Batch Voiceover Pipeline

Instead of generating voiceovers one at a time:
1. Write all 5 scripts in a batch
2. Upload all 5 to ElevenLabs in sequence
3. Download all 5 .mp3 files
4. Proceed to editing batch

**Time saved:** 10 min/day on context switching.

#### C. CapCut Template Presets

Build 2–3 saved CapCut project templates with:
- Pre-set caption styling (font, color, animation, position)
- Pre-set zoom keyframe patterns you can adjust
- Pre-set audio ducking for background music
- Pre-set export settings (9:16, 1080p, 30fps)

**Time saved:** 5–8 min per Short on setup.

#### D. Notion Production Database

| Column | Type | Purpose |
|---|---|---|
| Clip URL | URL | Source link |
| Status | Select: Candidate → Scored → Scripted → Edited → Reviewed → Posted | Pipeline tracking |
| Final Score | Number | Scoring engine result |
| Script | Long text | Voiceover script |
| Voiceover File | File | .mp3 attachment |
| Export File | File | Final .mp4 |
| Title | Text | YouTube title |
| Posted Date | Date | When uploaded |
| Performance | Number | Views after 48h (track manually) |

### Scaling Logic Without Breaking Policy Safety

| Scale Level | Output | Safety Check |
|---|---|---|
| Level 1 (MVP) | 3 Shorts/day | Full manual review of every Short |
| Level 2 (Advanced) | 5 Shorts/day | Full manual review, batch production |
| Level 3 (Team) | 7–10 Shorts/day | Hire 1 editor, you review all + upload all |
| Level 4 (Multi-channel) | 10+ Shorts/day across 2 channels | Each channel has distinct format + voice |

**Hard rule for scaling:** Never reduce review quality to increase volume. If you can't review 5 Shorts properly in a day, produce 4. Quality > Quantity at every level.

**Never do:**
- Auto-post without manual review
- Use the same script template for multiple Shorts
- Skip the scoring step to save time
- Post Shorts you haven't watched on your phone
- Scale past your ability to maintain transformation quality

---

## 12. RISK MAP

### Monetization Risks

| Risk | Severity | Likelihood | Reducible? | Mitigation |
|---|---|---|---|---|
| Reused-content rejection during YPP review | HIGH | MEDIUM | YES | Scoring engine + transformation checklist. Maintain project files as proof of creation. |
| Inauthentic content flag (too many AI-voiceover channels exist) | HIGH | MEDIUM | PARTIALLY | Ensure every script has genuine editorial insight, not filler. Vary pacing and structure. Keep a consistent voice identity. |
| Revenue share diluted by music licensing | LOW | HIGH | YES | Use only royalty-free music or no music. Never use copyrighted tracks. |
| YPP threshold changes | MEDIUM | LOW | NO | Build for current thresholds (10M Shorts views / 90 days). Track policy updates monthly. |

### Reused-Content Risks

| Risk | Severity | Likelihood | Reducible? | Mitigation |
|---|---|---|---|---|
| Source clip is already widely reposted | HIGH | HIGH | YES | Scoring engine Source Risk dimension. Reject clips reposted by 10+ channels. |
| Transformation is too superficial | HIGH | MEDIUM | YES | Mandatory transformation checklist: voiceover + captions + reframe + pacing + editorial structure. If any element is missing, don't post. |
| YouTube algorithm clusters your channel with repost farms | MEDIUM | MEDIUM | PARTIALLY | Maintain consistent format identity. Engage with comments. Build a real audience relationship. |

### Copyright Risks

| Risk | Severity | Likelihood | Reducible? | Mitigation |
|---|---|---|---|---|
| Copyright strike from source content owner | HIGH | LOW–MEDIUM | YES | Avoid copyrighted entertainment. Replace all original audio. Use scoring engine Source Risk filter. |
| Content ID claim on background music | LOW | MEDIUM | YES | Use only YouTube Audio Library or verified royalty-free sources. |
| DMCA from original clip creator | MEDIUM | LOW | PARTIALLY | Transform substantially. If a creator asks you to remove, comply immediately. |

### Advertiser-Friendly Risks

| Risk | Severity | Likelihood | Reducible? | Mitigation |
|---|---|---|---|---|
| Yellow icon (limited ads) on individual Shorts | MEDIUM | MEDIUM | YES | Advertiser Safety scoring + clean-first-5-seconds rule + no profanity/violence. |
| Channel-level advertiser restrictions | HIGH | LOW | YES | Maintain high advertiser safety across ALL content. One bad Short can taint the channel. |
| Self-certification error leading to trust score damage | MEDIUM | LOW | YES | Always self-certify accurately. When in doubt, mark as "not suitable for most advertisers" — it's safer than lying. |

### Operational Risks

| Risk | Severity | Likelihood | Reducible? | Mitigation |
|---|---|---|---|---|
| Burnout from daily production | MEDIUM | HIGH | YES | Batch production. Take weekends off. Pre-produce Friday for Monday. |
| Tool dependency (ElevenLabs goes down, CapCut changes pricing) | LOW | LOW | YES | No tool is irreplaceable. CapCut → DaVinci Resolve. ElevenLabs → Murf AI. Always have a backup. |
| Quality drift over time (shortcuts become habits) | MEDIUM | HIGH | YES | Run the review checklist for EVERY Short. Never skip. Schedule monthly self-audits. |
| ElevenLabs free tier exhausted mid-month | LOW | HIGH | YES | Upgrade to Starter plan ($5/mo) or batch scripts efficiently. |

### Unavoidable vs Reducible Risks

| Unavoidable | Reducible |
|---|---|
| YouTube policy changes | Reused-content flags (via transformation quality) |
| Revenue share structure | Advertiser safety flags (via content filtering) |
| Algorithm unpredictability | Copyright strikes (via source selection) |
| Market saturation of Shorts format | Burnout (via batching and scheduling) |
| AI content scrutiny increasing | Quality drift (via checklists) |

---

## 13. MANUAL REVIEW CHECKLIST

**Use this checklist for EVERY Short before uploading. No exceptions.**

### Visual Check (Watch on Phone)

- [ ] **Hook test:** Does the first 2 seconds grab my attention?
- [ ] **No watermarks:** Zero TikTok, Instagram, or other platform watermarks visible
- [ ] **No third-party branding:** No other channel logos or names visible
- [ ] **Clean visuals:** No graphic violence, nudity, injury, or disturbing content
- [ ] **Proper framing:** All key action is visible in the 9:16 crop
- [ ] **Caption readability:** Captions are large enough to read on a phone, no text cut off
- [ ] **Smooth edits:** No jarring cuts, glitches, or audio pops
- [ ] **Zoom quality:** Zooms serve a purpose and don't crop out key action
- [ ] **Length:** Between 35–58 seconds

### Audio Check

- [ ] **Voiceover clarity:** Narration is clear, properly paced, no artifacts
- [ ] **No original copyrighted audio:** Source audio is replaced or removed
- [ ] **Music level:** Background music (if any) is at 10–15% volume, not competing with narration
- [ ] **No profanity:** Zero profanity in narration or any remaining source audio
- [ ] **Clean first 5 seconds:** Nothing even mildly edgy in the first 5 seconds

### Content Check

- [ ] **Transformation test:** "Would a YouTube reviewer see this as original content?" → Must be yes
- [ ] **Advertiser test:** "Would Coca-Cola run an ad before this?" → Must be yes
- [ ] **Editorial value:** Narration adds genuine context, insight, or storytelling — not filler
- [ ] **Accuracy:** Narration does not fabricate false claims or misleading context
- [ ] **No religion, politics, controversy:** Content does not touch sensitive topics
- [ ] **No private individuals embarrassed:** No one is identifiable + humiliated

### Metadata Check

- [ ] **Title accuracy:** Title honestly represents the content. No clickbait.
- [ ] **Title length:** Under 70 characters
- [ ] **Description:** Accurate 2–3 sentence summary with relevant hashtags
- [ ] **Tags:** 5–8 relevant tags, no spam tags
- [ ] **Self-certification:** Advertiser-friendly self-certification is accurate

### Final Gate

- [ ] **"Would I be comfortable showing this to a YouTube reviewer during my monetization application?"**
  - If YES → Upload
  - If NO → Fix or discard

---

## 14. DECISION RULES

### When to REJECT a Clip

Reject immediately if:
- Any hard-rejection filter is triggered (Section 6)
- Any single scoring dimension is below its fail threshold
- Final weighted score is below 5.0
- You can't write a genuine 20-second narration script in 2 minutes
- The clip is already on 10+ other YouTube channels with similar editing
- You feel uncomfortable imagining a YouTube reviewer watching it
- The clip depends on copyrighted music, movie footage, or TV content

### When to PROCEED

Proceed confidently when:
- Final weighted score is 7.5+
- No single dimension is below its fail threshold
- You can immediately envision the narration angle
- The source is not widely reposted
- The content is fully advertiser-friendly
- You'd be proud to show this Short to a potential brand sponsor

### When to DOWNGRADE a Viral Candidate

Downgrade from "proceed" to "hold" when:
- Viral score is 8+ BUT advertiser safety is 6–7
- The clip is trending fast and will be saturated within 48 hours
- Transformation potential is only 5–6 (narration would be thin)
- Source origin is unclear and might be copyrighted

In these cases: produce only if your pipeline is short that day AND you add extra transformation effort.

### When to PRIORITIZE Safety Over Views

Always prioritize safety when:
- You're pre-monetization (before YPP approval) — every Short is a sample for reviewers
- You've recently received any community guidelines warning
- The clip would require "repairing" unsafe elements in post (bad audio, brief nudity, etc.)
- You're unsure whether the content violates a policy — uncertainty = reject
- Choosing the risky clip would mean only a 10–20% view increase vs the safe alternative

**The math:** One demonetization flag costs you more than 100 viral Shorts earn. Always choose the safe path.

### When to STOP Scaling

Stop increasing output when:
- Your review quality is dropping (you're rushing through the checklist)
- More than 20% of your Shorts in a week score below 6.5 final score
- You skip the scoring step more than once in a week
- You notice yourself rationalizing risky clips ("it'll probably be fine")
- You haven't watched any of your posted Shorts on your phone in the last 3 days
- You feel burned out and start caring less about transformation quality

**Rule:** Scale back by 1 Short/day until quality stabilizes.

---

## 15. 30-DAY LAUNCH PLAN

### Week 1: Foundation (Days 1–7)

| Day | Focus | Tasks | Output |
|---|---|---|---|
| 1 | Setup | Install CapCut Desktop. Create ElevenLabs account. Set up Google Sheet for tracking. Save all prompts from Prompt Pack into a document. | Tools ready |
| 2 | Voice Selection | Test 5–6 ElevenLabs voices with a sample script. Pick your channel voice. | Voice selected |
| 3 | Practice Edit | Find 1 safe clip. Write script. Generate voiceover. Edit a full Short using the template. Don't post — this is practice. | 1 practice Short |
| 4 | Practice Edit #2 | Repeat Day 3 with a different clip. Focus on caption styling and zoom timing. | 1 practice Short |
| 5 | First Real Batch | Use full workflow: discover → score → script → voice → edit → review → post. Produce 2 Shorts. | 2 posted Shorts |
| 6 | Second Batch | Produce 2 more Shorts. Time yourself at each stage. | 2 posted Shorts |
| 7 | Review & Adjust | Watch all 4 posted Shorts on your phone. Note what feels good vs weak. Adjust caption style or zoom patterns. | Process notes |

**Week 1 Target:** 4 posted Shorts. Process understood. Timing benchmarks established.

---

### Week 2: Rhythm (Days 8–14)

| Day | Focus | Tasks | Output |
|---|---|---|---|
| 8 | 3-Short Day | Full workflow. Target: 3 Shorts in one session. | 3 Shorts |
| 9 | 3-Short Day | Repeat. Focus on batch efficiency (all scripts → all voices → all edits). | 3 Shorts |
| 10 | 3-Short Day | Repeat. Start noting which content categories score highest. | 3 Shorts |
| 11 | Analysis | Review all Shorts posted so far. Check view counts at 24h and 48h. Identify top performer. | Performance log |
| 12 | 3-Short Day | Produce 3 Shorts leaning toward your best-performing content type. | 3 Shorts |
| 13 | 3-Short Day | Repeat. | 3 Shorts |
| 14 | Rest + Review | Day off from production. Review all metrics. Update Google Sheet with performance data. | Weekly review |

**Week 2 Target:** 15 Shorts total posted. Consistent 3/day rhythm. Performance patterns emerging.

---

### Week 3: Optimization (Days 15–21)

| Day | Focus | Tasks | Output |
|---|---|---|---|
| 15 | Push to 4 | Try producing 4 Shorts. Note if quality drops. | 4 Shorts |
| 16 | Content Mix Testing | Produce 3 Shorts in different content categories (e.g., engineering, animals, skills). | 3 Shorts |
| 17 | Narration Style Testing | Try a slightly different narration tone on 1 of 3 Shorts (more humorous, more serious, etc.). | 3 Shorts |
| 18 | 4-Short Day | If Day 15 quality held, try 4 again. If not, stay at 3. | 3–4 Shorts |
| 19 | 4-Short Day | Continue pushing gently. | 3–4 Shorts |
| 20 | Deep Performance Review | Analyze all Shorts: top 5 by views, bottom 5. What patterns emerge? Update content strategy. | Strategy document |
| 21 | Rest | No production. Plan Week 4. | Rest |

**Week 3 Target:** 25–30 total Shorts posted. Content categories ranked. Pushing toward 4/day.

---

### Week 4: Scale & Systematize (Days 22–30)

| Day | Focus | Tasks | Output |
|---|---|---|---|
| 22 | 4–5 Short Day | Full batch production at higher volume. | 4–5 Shorts |
| 23 | Template Refinement | Create 2 CapCut preset templates for faster editing. | Templates saved |
| 24 | 4–5 Short Day | Use templates. Measure time savings. | 4–5 Shorts |
| 25 | Tool Evaluation | Decide: Do you need Virlo/TubeLab for discovery? Do you need ElevenLabs paid? | Upgrade decisions |
| 26 | 4–5 Short Day | Continue. | 4–5 Shorts |
| 27 | 4–5 Short Day | Continue. | 4–5 Shorts |
| 28 | Friday Pre-production | Produce Saturday and Sunday's Shorts in advance (batch 6–10 for the weekend). | Pre-produced batch |
| 29 | Rest (pre-produced content posts) | | Auto-scheduled posts |
| 30 | Month Review | Full audit: total Shorts, total views, avg views/Short, best/worst content, process time per Short, any policy warnings. Write lessons learned. Plan Month 2. | Month 1 Report |

**Week 4 Target:** 40–50 total Shorts posted. 4–5/day sustainable. Process systematized.

---

### 30-Day Summary Milestones

| Milestone | Target |
|---|---|
| Total Shorts posted | 40–50 |
| Daily production rhythm | 3–5 per day |
| Average production time | Under 3.5 hours/day |
| Copyright strikes | 0 |
| Community Guidelines warnings | 0 |
| Consistent narrator voice | Established |
| Consistent caption style | Established |
| Content categories ranked | Top 3 identified |
| Performance tracking | Active with data |
| YPP progress | Tracking toward 500 subs + 3M Shorts views |

---

## SELF-CHECK VERIFICATION

Before delivering this system, I verified:

| Check | Status |
|---|---|
| All 15 sections present | ✅ |
| All non-negotiable rules respected | ✅ |
| No drift into repost strategy | ✅ — Every Short requires voiceover + captions + reframe + editorial structure |
| Tradeoffs made explicit | ✅ — Decision Rules section covers every tradeoff scenario |
| Real usable system, not generic advice | ✅ — Exact prompts, exact tools, exact daily schedule, exact checklists |
| Laptop-first, one person | ✅ — No servers, no team, no APIs required at MVP |
| Final posting stays manual | ✅ — Stage 6 is always manual upload |
| Monetization safety prioritized | ✅ — 30% weight on monetization in scoring; safety overrides virality in all decision rules |
| Supports 3–5 Shorts/day | ✅ — Daily SOP budgets 2.5–4 hours for 3–5 Shorts |
| Not dependent on raw reposting | ✅ — Transformation template mandates 7+ changes from source to final |

---

> **System files:**
> - Part 1: Sections 1–5 (System Summary, Channel Format, Tool Stack, Automation Architecture, Scoring Engine)
> - Part 2: Sections 6–9 (Source Filter Rules, Editing Template, Daily SOP, Prompt Pack)
> - Part 3: Sections 10–15 (MVP Build, Advanced Build, Risk Map, Review Checklist, Decision Rules, 30-Day Plan)
