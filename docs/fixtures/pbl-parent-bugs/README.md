# Existing parent card defects discovered while reviewing PBL prints

Non-shipping red fixtures. Both inherited PBL reprints remain deferred until the
base behavior is fixed and checked against existing puzzles.

- Brave Bangle: Groudon M6's Brutal Lands has printed base 0+, but deals 170
  against Mew ex with Legendary Pyroduct in play. Brave Bangle should add 30;
  the existing base checks printed `attack.damage > 0` and leaves it at 170.
  The no-Tool control passes; the real-Tool case is red.
- Iron Defender: playing it incorrectly reduces your own attack against an
  opponent's Metal Pokémon in the current turn. A control confirms it reduces
  the opponent's next-turn attack against your Metal Pokémon. The opposing-Metal
  test is red. Both tests use a real Item play and attack; the next-turn control advances
  through the real end-turn action.

Copy the two specs into a disposable simulator checkout and run:

```sh
cp docs/fixtures/pbl-parent-bugs/fixture/ptcg-server/src/sets/tests/*.ts /path/to/checkout/ptcg-server/src/sets/tests/
cd /path/to/checkout/ptcg-server
node scripts/test-card-regressions.cjs --filter=brave-bangle-zero-base-independent
node scripts/test-card-regressions.cjs --filter=iron-defender-independent
```

Both use already-registered base printings; neither adds a PBL card or changes
production behavior. Verify the four exact PBL artwork mappings and printed
regulation marks separately before adding those reprints.
