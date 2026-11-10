import { SortableSpec } from '@ng-dnd/sortable';
import { DragSource } from '@ng-dnd/core';

import { PromptItem } from '../prompt-card-item.interface';

export interface PromptSortable {
  spec: SortableSpec<PromptItem>;
  list: PromptItem[];
  tempList: PromptItem[];
}

export interface PromptCardItem extends PromptItem {
  showButtons?: boolean;
  originalIndex?: number;
  element?: HTMLElement;
  isLeftSide?: boolean;
  isLeftBack?: boolean;
}

export const SelectorCardType = 'CARD_SELECTOR';

export interface SelectorDraggedCard {
  data: PromptCardItem;
  promptId: number;
  localId: number;
  selected: boolean;
}

export interface PromptCardStack {
  source: DragSource<SelectorDraggedCard>;
  key: string;
  front: PromptCardItem;
  copies: PromptCardItem[];
}
