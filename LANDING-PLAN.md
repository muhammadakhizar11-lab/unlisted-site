# Landing page improvement plan

Goal: a first screen that shows what you get, a page with more colour and rhythm, and motion that explains the product. Keep the purple brand (#6D28D9). Check each phase with the Taste Skill lint and inspect scripts, redeploy, and review on a phone.

## Phase 0: direction (half a day)
- Run `paint` (genjutsu) and ui-ux-pro-max to propose a visual identity inside the purple brand. Approve before building.
- References (qualities only, never copy): Casper's Caviar for colour-coded panels, big broken headlines and quiet premium feel; Book of Shapes for generative SVG patterns; Tim Ricks for scroll, hover and text animation patterns.

## Phase 1: hero (biggest impact)
- Replace the empty hero space with a product visual: a large cropped list file (firm rows) beside the headline.
- Option A: an isometric illustration of "a firm list" made with `anatomy` (SVG). Option B: a generative SVG pattern in purple tones. Option C: a live-looking file preview, built in HTML.
- Pick one after seeing two quick drafts.

## Phase 2: colour and rhythm
- Give each of the 11 lists its own tone from one purple-based family, as full-width alternating panels (the colour-coding idea from Casper's Caviar).
- Add one more full purple section so the page is not mostly pale.
- Make the fragment tables bigger (16px minimum) and more prominent.

## Phase 3: motion (GSAP, free)
- Scroll sequence: the list file fills in row by row as you scroll through "how it works" (ScrollTrigger).
- Headline line reveals and number count-ups (SplitText).
- Hover and press feedback on buttons, rows and FAQ (`cast`, Emil Kowalski).
- Timing and easing from the LottieFiles motion-design skill. Reduced-motion fallback required.

## Phase 4: imagery (optional)
- Real photographs or short looping video only if you supply assets you have the rights to. Cloudflare already serves static files free. Consider R2 only if video makes the site heavy.
- Use potrace if you want to turn a hand sketch or logo into a clean SVG.

## Phase 5: checks
- Taste Skill lint and inspect (accept the purple flag), Impeccable audit, a Lighthouse run for speed and accessibility, and a phone test.

## Not using, and why
- ReactDrops and 21st.dev: React and Tailwind components. This site is plain HTML. 21st.dev also limits free copies.
- DesignDNA: paid ($39 or $59) and it extracts other sites' design systems.
- algorithmic-art skill: only useful for a background pattern. Covered by anatomy and Book of Shapes-style SVG.
- Three.js: only if you want a 3D hero. Heavier and riskier on phones.
- Vercel: not needed, Cloudflare already hosts the site.
