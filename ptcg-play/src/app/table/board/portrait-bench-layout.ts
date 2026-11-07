const ASPECT_RATIO = 1.37;
const TOP_HAND_COUNT_SPACE = 28;

export function activeCardSize(width: number, height: number, scale: number): number {
  return (width <= 390 && height <= 600 ? 72 : 87) * scale;
}

/** Reserve both player areas by viewport, never by the number of cards in play. */
export function portraitBenchLayout(width: number, height: number, scale: number,
  capacities: number[], normalHandSpace: number) {
  const activeHeight = activeCardSize(width, height, scale) * ASPECT_RATIO;
  // Give the height reclaimed by compact Active cards to the visible hand.
  const minimumHandSpace = 74 + 2 * (87 * scale * ASPECT_RATIO - activeHeight);
  const overhead = (rows: number, gap: number) => 12 + (rows - 1) * gap;
  // The opponent has one 44px rail; our bench has Prizes and Discard rails.
  const widthLimit = (columns: number, gap: number, own = false) =>
    (width - (own ? 116 : 72) - (columns - 1) * gap) / columns;
  let playerGap = 8;
  let boardGap = 8;
  let handSpace = normalHandSpace;
  let ownMinimum = 64 * scale;
  let bottomColumns = Math.ceil(capacities[1] / 2);
  let bottomRows = 2;
  const minimumTopHeight = () => TOP_HAND_COUNT_SPACE + activeHeight + playerGap + overhead(1, 4) + 54 * scale * ASPECT_RATIO;
  const minimumBottomHeight = () => activeHeight + playerGap + overhead(bottomRows, 6)
    + ownMinimum * bottomRows * ASPECT_RATIO;
  const fieldsHeight = () => height - 4 - handSpace - boardGap;

  if (fieldsHeight() < minimumTopHeight() + minimumBottomHeight()) {
    ownMinimum = 60 * scale;
    playerGap = 4;
    boardGap = 2;
  }
  if (fieldsHeight() < minimumTopHeight() + minimumBottomHeight() && handSpace > minimumHandSpace) {
    handSpace = Math.max(minimumHandSpace, height - 4 - boardGap - minimumTopHeight() - minimumBottomHeight());
  }
  const smallestTopHeight = TOP_HAND_COUNT_SPACE + activeHeight + playerGap + overhead(1, 4) + 33 * scale * ASPECT_RATIO;
  if (fieldsHeight() < smallestTopHeight + minimumBottomHeight()) {
    const fittedSize = (fieldsHeight() - smallestTopHeight - activeHeight - playerGap - overhead(2, 6)) / (2 * ASPECT_RATIO);
    // Compact native screens (including the SE) retain more legible cards in
    // two rows than an eight-card fallback row beside both pile buttons.
    if (fittedSize >= 36 * scale) {
      ownMinimum = fittedSize;
    } else {
      // Very short embedded phones retain full-size Active cards and controls.
      // Reserve the same one-row budget for either bench capacity.
      bottomColumns = capacities[1];
      bottomRows = 1;
      ownMinimum = Math.min(64 * scale, widthLimit(8, 6, true));
    }
  }

  // Aim for the midpoint, leaving enough room for our two bench rows. The
  // constraint uses a fixed card size, so 5 -> 8 capacity cannot move Actives.
  let topFieldHeight = Math.min(fieldsHeight() / 2, fieldsHeight() - minimumBottomHeight());
  if (bottomRows === 1) {
    const topWithCount = TOP_HAND_COUNT_SPACE + activeHeight + playerGap + overhead(1, 4) + ownMinimum * ASPECT_RATIO;
    topFieldHeight = Math.min(fieldsHeight() - minimumBottomHeight(), Math.max(topFieldHeight, topWithCount));
  }
  const bottomFieldHeight = fieldsHeight() - topFieldHeight;
  const bottomSize = Math.min(69 * scale, widthLimit(bottomColumns, 6, true),
    (bottomFieldHeight - activeHeight - playerGap - overhead(bottomRows, 6)) / (bottomRows * ASPECT_RATIO));
  const topSizeFor = (columns: number) => {
    const rows = Math.ceil(capacities[0] / columns);
    return Math.min(bottomSize, widthLimit(columns, 4),
      (topFieldHeight - TOP_HAND_COUNT_SPACE - activeHeight - playerGap - overhead(rows, 4)) / (rows * ASPECT_RATIO));
  };
  let topColumns = capacities[0];
  let topSize = topSizeFor(topColumns);
  const alternateColumns = Math.ceil(capacities[0] / 2);
  const alternateSize = topSizeFor(alternateColumns);
  if (alternateSize >= topSize + 4 * scale) {
    topColumns = alternateColumns;
    topSize = alternateSize;
  }
  return { topColumns, bottomColumns, topSize, bottomSize, handSpace, playerGap, boardGap,
    topFieldHeight, bottomFieldHeight };
}
