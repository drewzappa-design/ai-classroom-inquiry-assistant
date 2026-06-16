# EduMemory Recording Checklist

## Pre-Recording Setup

- Use Chrome or Edge.
- Open a fresh browser window.
- Use an incognito/private window if you want clean `localStorage`.
- Close unrelated tabs.
- Hide bookmarks bar if it takes too much space.
- Set browser zoom to 100%.
- Turn off notifications.
- Prepare the voiceover script: `docs/hackathon/PITCH_SCRIPT_5_MIN.md`.
- Start the app:

```bash
python3 -m http.server 4173
```

Open:

`http://localhost:4173/?role=edumemory`

Click **Presentation Mode** before recording.

## Browser Size

Recommended recording size:

- 1440 x 900 for a polished desktop walkthrough
- 1280 x 720 if the video must be standard HD

Avoid very narrow widths. The demo is responsive, but the judge video should show the product as a desktop web app.

## Screens To Capture

1. EduMemory landing section with logo and tagline
2. Maya Rodriguez student profile and Engineering Reflection
3. EduMemory Agent Analysis after clicking **Analyze Growth**
4. Walrus Learning Memory after clicking **Create Learning Memory**
5. Teacher Verification page
6. Evidence Review
7. Verified Learning Credential after approval
8. Student Portfolio
9. Opportunity Matching with match reasons

## Click Order

1. Open `http://localhost:4173/?role=edumemory`.
2. Click **Presentation Mode**.
3. Pause on landing section for 5-8 seconds.
4. Scroll or move to Maya's Engineering Reflection.
5. Click **Analyze Growth**.
6. Pause on EduMemory Agent Analysis.
7. Click **Create Learning Memory**.
8. Pause on Walrus Learning Memory.
9. Click **Teacher** in the EduMemory side navigation.
10. Click **Review Evidence**.
11. Click **Approve Engineering Design Level 1**.
12. Pause on the Sui credential card.
13. Click **Portfolio**.
14. Pause on Maya's portfolio.
15. Click **Opportunities**.
16. Pause on the opportunity matching cards.

## Voiceover Timing

### 0:00-0:30

Introduce EduMemory and the problem: students forget years of awards, skills, projects, and eligibility evidence.

### 0:30-1:10

Explain the solution: AI documents growth, teacher verifies, Sui represents ownership, Walrus preserves evidence.

### 1:10-2:10

Show Maya's reflection and click **Analyze Growth**. Explain that AI documents her thinking, not replaces it.

### 2:10-2:55

Click **Create Learning Memory**. Explain Walrus as durable learning memory.

### 2:55-3:40

Show teacher verification and approve the credential. Explain why teacher verification matters.

### 3:40-4:25

Show the Sui credential and portfolio. Explain student ownership.

### 4:25-5:00

Show opportunity matching and close with the core message:

"AI did not replace the student's thinking. AI documented the student's growth and opened new opportunities."

## What Not To Show

- Do not show browser developer tools.
- Do not show local file paths in the address bar if using a public deployment.
- Do not show unrelated tabs or private accounts.
- Do not spend time on the original classroom dashboard unless mentioning that existing functionality is preserved.
- Do not imply production Sui transactions or production Walrus uploads are complete.
- Do not claim live LLM calls are running.
- Do not show unfinished backend or Supabase setup.

## Final Recording Check

- Audio is clear.
- Cursor movement is slow and intentional.
- The demo URL is visible at least once.
- Presentation Mode is on.
- The Sui/Walrus mock status is explained clearly.
- The video ends on either the credential card or opportunity matching.
