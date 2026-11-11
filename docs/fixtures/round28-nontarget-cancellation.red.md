# Existing non-targeted copy cancellation failure

The untouched post-round27 simulator applies 10 damage when Clefable JU uses
Metronome to copy Charmander BS's Scratch under an explicitly loaded Sand
Attack marker and a tails Coin flip prompt. The entire copied attack should do
nothing. A direct Scratch control deals zero damage as expected.

`round28-nontarget-cancellation.red.spec.fixture.ts` reproduces both controls
through real Store actions. It intentionally expects zero for the copied attack
and therefore fails on the baseline. The same failure occurs on the separate
chosen-target prototype: that work is not a fix for this independent legacy
copy cancellation defect. The first fixture attempt used a wrong ChooseAttack
index and was invalid; the version here uses index 0 and was rerun legally.
