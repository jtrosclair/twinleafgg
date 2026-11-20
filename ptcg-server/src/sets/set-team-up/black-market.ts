import { BlackMarketPrismStar } from './black-market-prism-star';

// Keep the alternate deck and snapshot name for the same print.
export class BlackMarket extends BlackMarketPrismStar {
  public name: string = 'Black Market \u25C7';
  public fullName: string = 'Black Market \u25C7 TEU';
  public text: string = 'When a Darkness Pok\u00e9mon (yours or your opponent\'s) that has any [D] Energy attached to it is Knocked Out by damage from an opponent\'s attack, that player takes 1 fewer Prize card. Whenever any player plays an Item or Supporter card from their hand, prevent all effects of that card done to this Stadium card. \u25C7 (Prism Star) Rule: You can\'t have more than 1 \u25C7 card with the same name in your deck. If a \u25C7 card would go to the discard pile, put it in the Lost Zone instead.';
}
