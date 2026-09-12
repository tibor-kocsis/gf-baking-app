# Design: Flour Mix Calculator

## Context

The formula engine has to satisfy a set of target bands and caps that can contradict
each other for a given cupboard. The classic case: only potato and tapioca on hand.
Potato wants to stay at or below 45% of the starch fraction (it gelatinises at
58-65 °C with a very high peak viscosity, so it sets the crumb before the oven spring
window closes), tapioca wants to stay at or below 50%, and the two shares must add up
to 100%. One of them has to give. The engine must therefore pick the least-bad
solution *and say which cap it relaxed*, rather than silently violating one.

## Decisions

### 1. The unimix is decomposed everywhere, including for cap checks

The sorghum unimix is 48% sorghum flour / 47% tapioca starch / 5% psyllium husk. Only
95% of its weight counts toward the flour+starch base; the psyllium sits outside it.

Caps are evaluated on the *decomposed* fractions, so unimix sorghum counts as sorghum
for the 60%-of-flour cap and unimix tapioca counts as tapioca for the 50%-of-starch
cap. A fraction counts as having "two or more" sources when the final mix has two or
more, unimix-derived ones included. This is the reading that keeps the engine
self-consistent with "every gram of it must be decomposed and counted", and it means a
cupboard of unimix + brown rice honestly reports brown rice running above its 60% cap
rather than hiding it.

Consequence: the single-starch overrides (potato only -> 70:30, tapioca only -> flag
gumminess, corn only -> no change) key off the *effective* starch set. With the unimix
switched on, tapioca is always in the mix, so "potato only" never fires unless the
unimix is off.

### 2. The solver is a small grid search, not a closed-form solution

Two free variables: the unimix weight `U`, and the flour:starch split, which the target
bands allow to move between 60:40 and 70:30 around the style target. Everything else
follows from those two. The engine evaluates the grid (split in 1% steps across the
band, `U` in 1 g steps up to the psyllium ceiling) and scores each candidate. A few
thousand evaluations of cheap arithmetic per keystroke is not worth optimising.

Candidates that cannot be built at all (more unimix flour than the flour target, more
unimix tapioca than the starch target) are rejected outright.

### 3. Scoring is a weighted sum that ranks the caps by physical consequence

```
score = 1000 * potatoOvershoot          // kills oven spring - the expensive mistake
      +  100 * otherCapOvershoots       // gumminess / one-note flour - recoverable
      +   50 * psylliumOutOfBandAmount
      +   20 * cornNotLargestShare
      +    5 * distanceFromStyleRatio
      +  smallTieBreak * (unimixCeiling - U)
```

Overshoots are in percentage points. The 10:1 weighting between potato and everything
else is the point: the engine will accept tapioca at 55% of the starch to keep potato
at 45%, and not the other way round. The final term implements "the unimix's share is
constrained by the caps, not by preference" — among otherwise equal solutions it takes
the most unimix, which for the potato/tapioca cupboard reproduces the documented rule
of thumb that *lowering* the unimix makes potato worse, not better.

### 4. Remaining flour and starch are distributed by preference weight, then clipped

The remaining flour is split across the available plain flours by weight
(sorghum 3, brown rice 2, millet 1 — "proportionally, favouring sorghum, then brown
rice, then millet"), then clipped to each cap (millet 35% of flour, any single flour
60% when two or more are in the mix) with the clipped excess redistributed among the
flours that still have headroom. The remaining starch uses the same water-filling
algorithm with corn weighted highest so it takes the largest single share when
available, then tapioca, then potato.

Pure greedy fill was rejected: with all three flours on hand it would give sorghum 60%,
brown rice 40% and millet nothing, which ignores "distribute proportionally".

### 5. Tangzhong flour never comes from the unimix

7% of the base, taken from the plain flour fraction: brown rice first, then plain
sorghum. Forcing the mix's psyllium through a boil makes the gel stiff and
non-yielding, which is a common cause of a loaf that neither rises nor collapses.

If neither brown rice nor plain sorghum is on hand (a unimix-only cupboard, or millet
only), the tangzhong cannot be built and the engine drops it and says so, rather than
quietly taking the flour from the mix. If the plain flour available is less than 7% of
the base, the tangzhong is scaled down to what there is.

### 6. Water is partitioned after hydration, and the gel ratio is the release valve

Hydration starts at 85% and takes the documented adjustments (brown rice > 40% of
flour +3, millet > 25% −2, potato > 40% of starch −3, tangzhong +3, psyllium above
4.5% +5 per 0.5%, missing psyllium −5). The psyllium adjustment is applied
proportionally rather than in steps so the stepper does not jump at a threshold.

The psyllium dose is 4.5% of the base, band 3.75–5.25%. These are whole-husk figures,
about 1.5x the 3% usually quoted, because the husk hydrates more slowly and builds less
structure per gram than the powder does. Both of the baker's own working recipes land at
4.3% and 4.7% of the base, which the powder figure does not explain.

The total then splits into tangzhong water (5x its flour), psyllium gel (10x the husk
weighed out separately) and the remainder. Only that husk is gelled: the unimix's
psyllium is already dispersed through its flour and starch, so it cannot be pre-hydrated
and takes its water from the mixing stream instead. If the remainder falls below 10% of
the base there is not enough free water left to slurry the yeast, so the gel ratio drops
to 1:8 and the split is recomputed — and if it is still short, the gel is capped at
whatever leaves 10% free and a note says so.

### 7. Relation to the worked reference case

The reference case in the engine brief (base 500, unimix + brown rice + potato +
tapioca + psyllium, tangzhong on, sandwich) lands on a 68:32 split with tapioca at 59%
of the starch. This engine lands on the style's own 65:35 with tapioca at 55% and
potato exactly at its 45% cap — the same shape, a smaller relaxation, and consistent
with the stated rules for hydration (which the reference's own 85% figure is not, since
brown rice above 40% and tangzhong on both add 3%). The brief marks that case as an
arithmetic sanity check and explicitly says not to hardcode it, so the normative rules
win where the two disagree.

### 8. The new screen is separate from DynamicRecipeView

`DynamicRecipeView` is built around one numeric stepper and branches per recipe id.
This calculator's input is a cupboard (toggles and multi-selects) and its output is a
formula breakdown rather than an ingredient list, so it gets its own screen and a
`type: 'flour-mix'` catalog entry that `AppNavigator` routes on. The catalog itself
needs no change — it already maps over every entry in `recipes`.

### 9. Output headings

The engine brief specifies Hungarian headings ("Összetevők százalékosan", "Bevizezés",
"Így oszlik meg a végeredmény", "Megjegyzések"). The app is translated, so those exact
strings go into `locales/hu.js` and the English and German locales get natural
equivalents. Hardcoding Hungarian would break the app's language selection.

Notes are returned from the calculator as `{ key, params }` pairs, not as formatted
sentences, so they stay translatable; the screen interpolates them the same way
`DynamicRecipeView` interpolates the baguette tangzhong amounts.
