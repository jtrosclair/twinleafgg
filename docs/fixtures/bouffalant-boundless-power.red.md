# Bouffalant SCR: missing Boundless Power restriction

Bouffalant SCR's printed Boundless Power says that it cannot attack during its next turn. The pre-fix reducer implemented Curly Wall but contained no attack-owned handler for that restriction. This was discovered while auditing the copied-attack ownership batch, which excluded Bouffalant. The subsequent local fix now implements the restriction for direct and copied attacks; this fixture documents the original baseline.

The adjacent nonshipping spec expects the attack to set `cannotAttackNextTurnPending` for both a direct user and a copied user. It failed on the pre-fix baseline. The shipping regression suite additionally tests turn transitions and expiry, switching, the actual source slot, copied users, Ability suppression, the SVP print, and real attack actions. Saved-state and initial-action comparisons are recorded in the sync notes.
