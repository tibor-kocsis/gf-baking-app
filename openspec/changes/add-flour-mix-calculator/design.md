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
(sorghum 3, brown rice 2, millet 1, chickpea 1 — "proportionally, favouring sorghum,
then brown rice, then millet"), then clipped to each cap (millet 35% of flour, chickpea
15%, any single flour
60% when two or more are in the mix) with the clipped excess redistributed among the
flours that still have headroom. The remaining starch uses the same water-filling
algorithm with corn weighted highest so it takes the largest single share when
available, then tapioca, then potato.

Pure greedy fill was rejected: with all three flours on hand it would give sorghum 60%,
brown rice 40% and millet nothing, which ignores "distribute proportionally".

### 5. The tangzhong is drawn from flour first, and the unimix is allowed

Order: brown rice, sorghum, millet, the unimix, then tapioca, corn, potato.

This was briefly changed to starch-first and then changed back. The record matters more
than the outcome, so: the starch-first case rested on the mechanism — a tangzhong works
only through the starch it gelatinises, a flour is only about three quarters starch, so
per gram a plain starch delivers 25-40% more of the substance doing the work. That
reasoning is still sound as far as it goes. What it lacked was any practice or trial
behind it. Every source that describes a tangzhong describes **flour** and water at 1:5;
none discusses substituting a pure starch, neither for nor against. One citation offered
in support of starch turned out, on checking, not to make the argument attributed to it.

The reason usually given for flour — that cooking it denatures gluten, so only about 10%
of the flour may be gelatinised before the crumb loses its structure — plainly does not
apply without gluten. But that makes the reason irrelevant here, not the practice wrong,
and those are different things. Absent a controlled comparison in gluten-free bread, and
none appears to exist, the default follows what is actually done.

One reason for flour does carry over intact: pre-cooking a whole-grain flour softens its
bran and takes the grittiness out. Brown rice is the grittiest of the three and leads for
that reason, which is also the first written justification this ordering has had — the
original brown-rice-first rule recorded none.

Starches remain as a fallback, so a cupboard with no flour can still build a tangzhong,
and so the baker's own baguette, whose tangzhong has always been tapioca, stays
expressible. Chickpea is excluded: raw legume flour carries its flavour through a boil,
and its protein is wanted set in the crumb rather than denatured in a paste.

The 1:5 ratio is a flour ratio, and is kept for every source. A pure starch at 1:5 is
about a third more concentrated in the substance that gels, so it gives a stiffer paste
than the recipes describe; correcting it to roughly 1:6.7 would be defensible arithmetic,
but starch is only a fallback now and the extra branch is not worth it.

An earlier version of this document forbade the unimix outright, on the grounds that
boiling its psyllium gives a stiff, non-yielding gel. **That was folklore.** Psyllium is
an arabinoxylan mucilage rather than a starch; its gel does not melt below 80 °C and its
heating and cooling curves superimpose, so the change is reversible — a boil neither
ruins it nor locks it, and practitioners pour boiling water straight onto psyllium as a
matter of routine. The rule also contradicted the baker's own long-standing baguette,
whose tangzhong is tapioca, and a recent loaf that took its tangzhong from the combined
dry blend — roughly 0.6 g of psyllium through the boil — and came out excellent.

Allowing the unimix as the final fallback also removes the case where a cupboard holding
no plain ingredient got no tangzhong at all.

**Not settled: the share.** It is now the baker's to set, 3-7%, defaulting to 5% rather
than the original 7%. One trial of pre-gelatinised rice flour put the optimum near 1% and
found 3-10% *reduced* loaf volume — which would make the original 7% actively harmful,
and matches a reported bake that came out dense with little oven spring. But that trial
dosed a dry pre-gelatinised flour rather than a cooked paste, so it is a proxy rather
than a measurement of this, and no controlled comparison of starch-tangzhong against
flour-tangzhong in gluten-free bread appears to exist at all. The range is exposed so the
question can be settled by baking rather than by argument.

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

### 10. Hydration stays style-independent — considered and rejected

The styles change the flour:starch ratio only. Cutting hydration for the free-standing
`rustic` style, on the theory that a slack dough spreads without a tin to hold it, was
proposed and checked against published recipes. Rejected.

The direction is real: across every developer who publishes the same dough in both
shapes, free-standing is never wetter than tin-baked. But the gap is small and the
magnitude barely constrained — within-author pairs give 0 to 7 points (median ~5), and
Loopy Whisk publishes one dough at 122% for both shapes, a gap of zero. Cross-author
comparison is worthless here: the tin cluster alone spans 67% to 157%.

What settles it is the level, not the gap. Published free-standing gluten-free loaves
run 90-123% hydration; Goyoaga free-forms a boule at 123% on 5% psyllium powder, a
banneton and a 500 °F Dutch oven. This engine's 85% base would put rustic at 78%, below
every free-standing psyllium recipe surveyed. The spreading those bakers manage by
cutting water bites somewhere above 100%, which is 20-40 points above where this engine
operates, so the adjustment would guard against a failure the formula does not reach.

A dough from this engine that will not hold its shape is therefore a binder, blend or
proofing problem rather than a water problem — a starch-heavy blend, an underdosed or
under-rested psyllium gel, or an over-proof — and those are where a fix belongs.

### 11. Chickpea flour is capped for flavour, and the roast matters more than the cap

Chickpea (besan) is in the flour list for its protein — 21-23% against sorghum's ~10%
and rice's ~8%. Protein coagulates on heating and sets permanently, which is the one
thing the starches in a unimix-built blend cannot do: tapioca is ~17% amylose and
retrogrades weakly, so a crumb built on it softens and compacts as it cools.

The 15% cap is the baker's own choice, and it is deliberately tighter than the evidence
requires. Published sensory work finds no rejection threshold below 30% — a wheat
sandwich bread at 7.5/15/30% showed no significant difference on any attribute, and a
gluten-free loaf at 40% of the flour blend still cleared 70% acceptability. 15% is
therefore comfortably in the background, with room to spare if it is ever raised.

What the trials show is that the **treatment matters far more than the dose**. At 25% of
the flour, raw chickpea gave a lower specific volume than the control (2.51 vs 2.63
cm³/g) and a much firmer crumb (13.4 vs 8.4 N) — worse on both counts. The same flour
roasted gave the highest volume of the trial (2.89), the softest crumb (5.5 N), the
highest porosity and the slowest staling. Raw chickpea is the wrong ingredient, not a
smaller version of the right one, so a note fires whenever chickpea is in the formula.

Hydration rises 2 points above a 10% share. Chickpea holds roughly twice the water of
rice flour (206 vs 115 g/100 g) and a farinograph puts the effect near +1.2 points at
this share, but one trial held water constant all the way to 30% with no loss of
quality, so this sits at the low end of the 1-3 point range the data supports.

Two things were deliberately not encoded. Chickpea is only ~40-48% starch against
sorghum's ~72%, so substituting it quietly removes about 2.7 points of total starch from
the base; widening the starch fraction to compensate is defensible arithmetic but no
trial isolates the effect, so the engine leaves it alone. And the crust browns markedly
harder (L* 72.5 to 52.9) from the extra protein, which is a baking-time adjustment
rather than a formula one.

Unlike every other flour, chickpea's cap is reported even when it is the only flour in
the cupboard. The general rule — caps apply once a fraction has two or more sources —
exists because a lone flour has no alternative. That reasoning holds for the neutral
flours, where a single-flour blend is merely plain; it does not hold for the one flour
whose cap is about taste.
