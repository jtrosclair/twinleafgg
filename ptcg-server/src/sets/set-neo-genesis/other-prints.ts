import { MetalEnergySpecial } from '../set-aquapolis/metal-energy-special';
import { RecycleEnergy } from '../set-unified-minds/recycle-energy';
import { SuperiorEnergyRetrieval } from '../set-plasma-freeze/superior-energy-retrieval';

export class MetalEnergyN1 extends MetalEnergySpecial {
  public fullName = 'Metal Energy N1';
  public name = 'Metal Energy';
  public set = 'N1';
  public setNumber = '19';
}

export class RecycleEnergyN1 extends RecycleEnergy {
  public fullName = 'Recycle Energy N1';
  public name = 'Recycle Energy';
  public set = 'N1';
  public setNumber = '105';
  public text = 'Recycle Energy provides [C] Energy. (Doesn\'t count as a basic Energy card.)\n\nIf this card is put into your discard pile from play, return it to your hand.';
}

export class SuperEnergyRetrieval extends SuperiorEnergyRetrieval {
  public fullName = 'Super Energy Retrieval N1';
  public name = 'Super Energy Retrieval';
  public set = 'N1';
  public setNumber = '89';
  public text = 'Trade 2 of the other cards in your hand for 4 basic Energy cards from your discard pile. If you have fewer than 4 basic Energy cards there, take all of them.';
}
