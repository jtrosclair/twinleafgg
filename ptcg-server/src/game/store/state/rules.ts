export class Rules {

  public firstTurnDrawCard = true;

  public firstTurnUseSupporter = true;

  public attackFirstTurn = false;

  // If true, supporters remain in the play zone until end-turn cleanup.
  public supporterCleanupAtEndTurn = false;

  public unlimitedEnergyAttachments = false;

  public alternativeSetup = false;

  // Optional to preserve the wire shape of existing puzzle snapshots.
  declare oldBurnRule?: boolean;

  // Omitted fields retain the modern one-per-turn and Stadium replacement rules.
  // Upstream retro snapshots may explicitly set these without rewriting older states.
  declare oneRetreatPerTurn?: boolean;
  declare oneStadiumPerTurn?: boolean;
  declare allowSameNameStadium?: boolean;

  constructor(init: Partial<Rules> = {}) {
    Object.assign(this, init);
  }

}
