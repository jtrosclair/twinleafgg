import { Request, Response } from 'express';
import { Controller, Get } from './controller';
import { CardsInfo } from '../interfaces/cards.interface';
import { CardManager } from '../../game';
import { Md5 } from '../../utils/md5';

const IMAGE_JSON_URL = 'https://amydev.me/twinleaf-json/image-jsons/limitlesstcg/small.json';

export class Cards extends Controller {

  private cardsInfo?: CardsInfo;
  private imageMap: Record<string, string> = {};

  @Get('/all')
  public async onAll(req: Request, res: Response) {
    if (!this.cardsInfo) {
      await this.fetchImageMap();
      this.cardsInfo = this.buildCardsInfo();
    }
    res.send({ ok: true, cardsInfo: this.cardsInfo });
  }

  @Get('/hash')
  public async onHash(req: Request, res: Response) {
    if (!this.cardsInfo) {
      await this.fetchImageMap();
      this.cardsInfo = this.buildCardsInfo();
    }
    const cardsTotal = this.cardsInfo.cards.length;
    const hash = this.cardsInfo.hash;
    res.send({ ok: true, cardsTotal, hash });
  }

  private async fetchImageMap(): Promise<void> {
    if (Object.keys(this.imageMap).length > 0) {
      return;
    }
    try {
      const response = await fetch(IMAGE_JSON_URL);
      if (response.ok) {
        this.imageMap = await response.json();
        console.log(`Loaded ${Object.keys(this.imageMap).length} card images from remote`);
      }
    } catch (error) {
      console.error('Failed to fetch card images:', error);
    }
  }

  private buildCardsInfo(): CardsInfo {
    const cardManager = CardManager.getInstance();
    const cards = cardManager.getAllCards();

    // Update card images from the image map.
    // Some Japanese-origin cards intentionally keep their original set/setNumber
    // for puzzle integrity, but can point image loading at a released US print.
    for (const card of cards) {
      const key = card.usSetNumber || `${card.set} ${card.setNumber}`;
      if (this.imageMap[key]) {
        card.cardImage = this.imageMap[key];
      }
    }

    const cardsInfo: CardsInfo = {
      cards,
      hash: ''
    };

    const hash = Md5.init(JSON.stringify(cardsInfo));
    cardsInfo.hash = hash;
    return cardsInfo;
  }
}
