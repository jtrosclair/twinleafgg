# Copied attack ownership: research fixture

This non-shipping script demonstrates why the two remaining adversarial tests in
`ptcg-server/src/sets/tests/copied-handler-ownership.spec.ts` cannot be solved
for arbitrary existing handlers solely by inspecting engine-visible execution.
It does not change any card or test.

## Reproduce

Install the repository's `ptcg-server` and `cloudflare` development dependencies,
then run from the repository root:

```sh
node docs/fixtures/copied-ownership-counterexample.cjs
```

The script uses `ts-node` from the server and `esbuild` from Cloudflare. Adjust
the path to the script if it is stored elsewhere, but keep the current working
directory at the repository root. It does not write to the repository.

Expected: the same serialized card data and same handler function produce direct
damage 90 and current legacy copied damage 90. Yet one external ownership
assignment requires copied damage 50, and another requires 80. The handler
contains two identical predicates, matching the important feature of the
`InitialOwnershipSource` acceptance fixture. Ordinary ownership comments are
also demonstrated to disappear into identical minified executable code.

The example's printed text deliberately does not specify which of the two
bonuses belongs to which source. It proves an information gap for general
unannotated inputs. The specific acceptance fixture's English text and comments
do distinguish the bonuses to a human. A bespoke rule, a hardcoded fixture, or
an unrestricted natural-language interpreter could produce its expected result;
none establishes a semantics-preserving generic partition of legacy reducers.

The inheritance case has the same missing boundary: ignoring every subclass
override can discard attack-owned behavior, whereas running its entire handler
can copy its Ability. The existing `AttackOverriddenSource` regression in
`copied-handler-explicit-ownership.spec.ts` demonstrates the first failure with
a real Onix subclass; `MixedOwnershipSource` demonstrates the second. A method
being called on a subclass or written after `super.reduceEffect` is not proof of
ownership. Deferred effects, delayed damage and nested callbacks must be included
in the declaration, not merely the initial `AttackEffect`.

## Minimal semantics-preserving direction

* Use the existing trusted prototype `reduceCopiedAttackEffect` contract to
  expose the attack-only handler, including all later reactions and cleanup.
  Split attack and Ability helpers in mixed real definitions, and have their
  normal reducer call both so direct attacks and Abilities remain unchanged.
* Metadata-only subclasses can inherit the contract; a subclass that overrides
  the ordinary reducer must explicitly supply or delegate its own contract.
  Continue legacy fallback while card definitions are migrated, with explicit
  regression tests for direct attacks, Ability suppression, copied attacks,
  delayed effects, inheritance, and existing puzzles.
* A trusted sidecar registry keyed to actual card definitions is an alternative
  source of the same missing ownership information. It does not make the
  handlers unannotated: the declaration has moved out of the class. A general
  structured rules representation could replace the callable, but likewise
  requires authoritatively authored ownership and a much broader migration.

The two original acceptance assertions can remain unchanged if their synthetic
card definitions supply the explicit ownership contract (or equivalent trusted
registry declaration). That validates the desired damage values but removes the
original tests' separate claim that arbitrary mixed handlers are automatically
separable without annotations. Keeping that claim intact requires keeping the
two failures visible until the source of ownership information changes; masking
the failure, matching fixture names, interpreting comments, or accepting an
incomplete heuristic would overstate correctness.
