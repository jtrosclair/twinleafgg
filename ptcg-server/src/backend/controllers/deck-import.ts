import { Request, Response } from 'express';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as https from 'https';

import { CardManager } from '../../game';
import { Controller, Post } from './controller';
import { Card } from '../../game/store/card/card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';

// Path to store unknown cards that need to be imported
const UNKNOWN_CARDS_FILE = join(__dirname, '../../../data/unknown-cards.json');

// Path to cache the image JSON
const IMAGE_CACHE_FILE = join(__dirname, '../../../data/limitlesstcg-images.json');

// URL for card images
const IMAGE_JSON_URL = 'https://amydev.me/twinleaf-json/image-jsons/limitlesstcg/large.json';

// Mapping of common import format set codes to internal set codes
// The import format uses codes like "CES" for Celestial Storm
// This maps them to the internal codes used in this codebase
const IMPORT_SET_CODE_MAP: { [key: string]: string } = {
  // Sun & Moon Era
  'SUM': 'SUM',
  'GRI': 'GRI',
  'BUS': 'BUS',
  'SLG': 'SLG',
  'CIN': 'CIN',
  'UPR': 'UPR',
  'FLI': 'FLI',
  'CES': 'CES',
  'DRM': 'DRM',
  'LOT': 'LOT',
  'TEU': 'TEU',
  'DET': 'DET',
  'UNB': 'UNB',
  'UNM': 'UNM',
  'HIF': 'HIF',
  'CEC': 'CEC',
  // Sword & Shield Era
  'SSH': 'SSH',
  'RCL': 'RCL',
  'DAA': 'DAA',
  'CPA': 'CPA',
  'VIV': 'VIV',
  'SHF': 'SHF',
  'BST': 'BST',
  'CRE': 'CRE',
  'EVS': 'EVS',
  'CEL': 'CEL',
  'FST': 'FST',
  'BRS': 'BRS',
  'ASR': 'ASR',
  'PGO': 'PGO',
  'LOR': 'LOR',
  'SIT': 'SIT',
  'CRZ': 'CRZ',
  // Scarlet & Violet Era
  'SVP': 'SVP',
  'SVI': 'SVI',
  'PAL': 'PAL',
  'OBF': 'OBF',
  'MEW': 'MEW',
  'PAR': 'PAR',
  'PAF': 'PAF',
  'TEF': 'TEF',
  'TWM': 'TWM',
  'SFA': 'SFA',
  'SCR': 'SCR',
  'SSP': 'SSP',
  'PRE': 'PRE',
  'JTG': 'JTG',
  // Black & White Era
  'BLW': 'BLW',
  'EPO': 'EPO',
  'NVI': 'NVI',
  'NXD': 'NXD',
  'DEX': 'DEX',
  'DRX': 'DRX',
  'DRV': 'DRV',
  'BCR': 'BCR',
  'PLS': 'PLS',
  'PLF': 'PLF',
  'PLB': 'PLB',
  'LTR': 'LTR',
  'BWP': 'BWP',
  // XY Era
  'XY': 'XY',
  'FLF': 'FLF',
  'FFI': 'FFI',
  'PHF': 'PHF',
  'PRC': 'PRC',
  'DCR': 'DCR',
  'ROS': 'ROS',
  'AOR': 'AOR',
  'BKT': 'BKT',
  'BKP': 'BKP',
  'GEN': 'GEN',
  'FCO': 'FCO',
  'STS': 'STS',
  'EVO': 'EVO',
  'XYP': 'XYP',
  // WOTC Era
  'BS': 'BS',
  'JU': 'JU',
  'FO': 'FO',
  'TR': 'TR',
  'G1': 'G1',
  'G2': 'G2',
  'N1': 'N1',
  'N2': 'N2',
  'N3': 'N3',
  'N4': 'N4',
  'LC': 'LC',
  // Promos
  'SMP': 'SMP',
  'SM': 'SMP', // Alternative notation
  'PR-SM': 'SMP',
};

interface ParsedCard {
  quantity: number;
  name: string;
  setCode: string;
  setNumber: string;
  originalLine: string;
}

interface CardResult {
  quantity: number;
  name: string;
  setCode: string;
  setNumber: string;
  fullName: string;
  known: boolean;
  cardData?: Card;
  cardImage?: string;
  superType?: string;
  subType?: string;
}

interface UnknownCard {
  name: string;
  setCode: string;
  setNumber: string;
  fullName: string;
  importLine: string;
  addedAt: string;
}

interface UnknownCardsFile {
  lastUpdated: string;
  cards: UnknownCard[];
}

export class DeckImport extends Controller {

  private imageCache: Map<string, string> | null = null;

  @Post('/parse')
  public async onParse(req: Request, res: Response) {
    const { deckList } = req.body;

    if (!deckList || typeof deckList !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'deckList is required and must be a string'
      });
    }

    // Load image cache
    await this.loadImageCache();

    const result = this.parseDeckList(deckList);
    return res.json(result);
  }

  @Post('/parse-and-save-unknown')
  public async onParseAndSaveUnknown(req: Request, res: Response) {
    const { deckList } = req.body;

    if (!deckList || typeof deckList !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'deckList is required and must be a string'
      });
    }

    // Load image cache
    await this.loadImageCache();

    const result = this.parseDeckList(deckList);

    // Save unknown cards to file
    if (result.unknownCards.length > 0) {
      this.saveUnknownCards(result.unknownCards);
    }

    return res.json({
      ...result,
      unknownCardsSaved: result.unknownCards.length > 0
    });
  }

  @Post('/get-cards')
  public async onGetCards(req: Request, res: Response) {
    const { cards } = req.body;

    if (!Array.isArray(cards)) {
      return res.status(400).json({
        ok: false,
        error: 'cards is required and must be an array'
      });
    }

    // Load image cache
    await this.loadImageCache();

    const cardManager = CardManager.getInstance();
    const allCards = cardManager.getAllCards();

    // Build lookup maps
    const cardsByFullName = new Map<string, Card>();
    const cardsByNameSetNumber = new Map<string, Card>();

    for (const card of allCards) {
      cardsByFullName.set(card.fullName.toLowerCase(), card);
      const key = `${card.name.toLowerCase()}|${card.set.toLowerCase()}|${card.setNumber}`;
      cardsByNameSetNumber.set(key, card);
    }

    interface CardMetadata {
      name: string;
      setCode: string;
      setNumber: string;
      fullName: string;
      cardData?: Card;
      cardImage?: string;
      superType?: string;
      subType?: string;
    }

    const results: CardMetadata[] = [];

    for (const cardIdentifier of cards) {
      // Try to find the card
      const card = cardsByFullName.get(cardIdentifier.toLowerCase());

      if (card) {
        results.push({
          name: card.name,
          setCode: card.set,
          setNumber: card.setNumber,
          fullName: card.fullName,
          cardData: card,
          cardImage: this.getCardImage(card.set, card.setNumber),
          superType: this.getSuperTypeString(card.superType),
          subType: this.getSubTypeString(card)
        });
      }
    }

    return res.json({
      ok: true,
      cards: results,
      count: results.length
    });
  }

  private parseDeckList(deckList: string): {
    ok: boolean;
    knownCards: CardResult[];
    unknownCards: CardResult[];
    totalCards: number;
    parseErrors: string[];
  } {
    const cardManager = CardManager.getInstance();
    const allCards = cardManager.getAllCards();

    // Build lookup maps
    const cardsByFullName = new Map<string, Card>();
    const cardsByNameSetNumber = new Map<string, Card>();

    for (const card of allCards) {
      cardsByFullName.set(card.fullName.toLowerCase(), card);
      // Create a key by name + set + setNumber
      const key = `${card.name.toLowerCase()}|${card.set.toLowerCase()}|${card.setNumber}`;
      cardsByNameSetNumber.set(key, card);
    }

    const lines = deckList.split('\n');
    const knownCards: CardResult[] = [];
    const unknownCards: CardResult[] = [];
    const parseErrors: string[] = [];
    let totalCards = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines and section headers
      if (!trimmedLine ||
        trimmedLine.startsWith('Pokémon:') ||
        trimmedLine.startsWith('Pokemon:') ||
        trimmedLine.startsWith('Trainer:') ||
        trimmedLine.startsWith('Energy:') ||
        trimmedLine.match(/^(Pokémon|Pokemon|Trainer|Energy|Total Cards):\s*\d+$/i)) {
        continue;
      }

      const parsed = this.parseCardLine(trimmedLine);
      if (!parsed) {
        parseErrors.push(`Could not parse line: "${trimmedLine}"`);
        continue;
      }

      totalCards += parsed.quantity;

      // Try to find the card
      const setCode = IMPORT_SET_CODE_MAP[parsed.setCode.toUpperCase()] || parsed.setCode.toUpperCase();

      // First try: exact fullName match (Name SET)
      const fullName = `${parsed.name} ${setCode}`;
      let card = cardsByFullName.get(fullName.toLowerCase());

      // Second try: name + set + number match
      if (!card) {
        const key = `${parsed.name.toLowerCase()}|${setCode.toLowerCase()}|${parsed.setNumber}`;
        card = cardsByNameSetNumber.get(key);
      }

      // Third try: just by fullName without number matching
      if (!card) {
        card = cardManager.getCardByName(fullName);
      }

      const cardResult: CardResult = {
        quantity: parsed.quantity,
        name: parsed.name,
        setCode: setCode,
        setNumber: card ? card.setNumber : parsed.setNumber,
        fullName: card ? card.fullName : fullName,
        known: !!card,
        cardData: card || undefined,
        cardImage: this.getCardImage(setCode, card ? card.setNumber : parsed.setNumber),
        superType: card ? this.getSuperTypeString(card.superType) : undefined,
        subType: card ? this.getSubTypeString(card) : undefined
      };

      if (card) {
        knownCards.push(cardResult);
      } else {
        unknownCards.push(cardResult);
      }
    }

    return {
      ok: true,
      knownCards,
      unknownCards,
      totalCards,
      parseErrors
    };
  }

  private async loadImageCache(): Promise<void> {
    // If already loaded, return
    if (this.imageCache !== null) {
      return;
    }

    // Try to load from cache file first
    if (existsSync(IMAGE_CACHE_FILE)) {
      try {
        const content = readFileSync(IMAGE_CACHE_FILE, 'utf-8');
        const data = JSON.parse(content);
        this.imageCache = new Map(Object.entries(data));
        return;
      } catch {
        // If cache file is corrupted, download fresh
      }
    }

    // Download from URL
    return new Promise((resolve, reject) => {
      https.get(IMAGE_JSON_URL, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            this.imageCache = new Map(Object.entries(jsonData));

            // Ensure directory exists
            const dir = join(__dirname, '../../../data');
            if (!existsSync(dir)) {
              const { mkdirSync } = require('fs');
              mkdirSync(dir, { recursive: true });
            }

            // Save to cache file
            writeFileSync(IMAGE_CACHE_FILE, JSON.stringify(jsonData, null, 2), 'utf-8');
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', (error) => {
        // If download fails, continue without images
        this.imageCache = new Map();
        resolve();
      });
    });
  }

  private getCardImage(setCode: string, setNumber: string): string | undefined {
    if (!this.imageCache) {
      return undefined;
    }

    // Format: "SETCODE SETNUMBER" (e.g., "CES 71")
    const key = `${setCode} ${setNumber}`;
    return this.imageCache.get(key);
  }

  private getSuperTypeString(superType: SuperType): string {
    switch (superType) {
      case SuperType.POKEMON:
        return 'Pokemon';
      case SuperType.TRAINER:
        return 'Trainer';
      case SuperType.ENERGY:
        return 'Energy';
      default:
        return 'Unknown';
    }
  }

  private getSubTypeString(card: Card): string | undefined {
    // Only Trainer cards have subTypes
    if (card.superType !== SuperType.TRAINER) {
      return undefined;
    }

    const trainerCard = card as TrainerCard;
    switch (trainerCard.trainerType) {
      case TrainerType.ITEM:
        return 'Item';
      case TrainerType.SUPPORTER:
        return 'Supporter';
      case TrainerType.STADIUM:
        return 'Stadium';
      case TrainerType.TOOL:
        return 'Tool';
      default:
        return undefined;
    }
  }

  private parseCardLine(line: string): ParsedCard | null {
    // Format: "QUANTITY NAME SET NUMBER"
    // Examples:
    //   "3 Onix CES 71"
    //   "1 Tapu Lele-GX GRI 60"
    //   "4 Double Colorless Energy SUM 136"
    //   "1 Articuno-GX CES 31"

    // Handle basic energy with optional set/number
    const basicEnergyMatch = line.match(/^(\d+)\s+(Fire|Water|Grass|Lightning|Psychic|Fighting|Darkness|Metal|Fairy)\s+Energy(?:\s+([A-Z]{2,4})\s+(\d+[a-z]?))?$/i);

    if (basicEnergyMatch) {
      return {
        quantity: parseInt(basicEnergyMatch[1], 10),
        name: `${basicEnergyMatch[2]} Energy`,
        setCode: 'SUM', // Use provided set code or default to SUM
        setNumber: basicEnergyMatch[4] || '0',
        originalLine: line
      };
    }

    // Standard format: QUANTITY NAME SET NUMBER
    // The tricky part is that NAME can have spaces, so we match from the end
    const match = line.match(/^(\d+)\s+(.+?)\s+([A-Z]{2,4})\s+(\d+[a-z]?)$/i);
    if (match) {
      return {
        quantity: parseInt(match[1], 10),
        name: match[2].trim(),
        setCode: match[3].toUpperCase(),
        setNumber: match[4],
        originalLine: line
      };
    }

    // Alternative format with SV prefix: "1 Card Name SV01 123"
    const svMatch = line.match(/^(\d+)\s+(.+?)\s+(SV\d+[A-Z]?)\s+(\d+)$/i);
    if (svMatch) {
      return {
        quantity: parseInt(svMatch[1], 10),
        name: svMatch[2].trim(),
        setCode: svMatch[3].toUpperCase(),
        setNumber: svMatch[4],
        originalLine: line
      };
    }

    return null;
  }

  private saveUnknownCards(unknownCards: CardResult[]): void {
    let existingData: UnknownCardsFile = {
      lastUpdated: new Date().toISOString(),
      cards: []
    };

    // Load existing file if it exists
    if (existsSync(UNKNOWN_CARDS_FILE)) {
      try {
        const content = readFileSync(UNKNOWN_CARDS_FILE, 'utf-8');
        existingData = JSON.parse(content);
      } catch {
        // Start fresh if file is corrupted
      }
    }

    // Add new unknown cards, avoiding duplicates
    const existingKeys = new Set(existingData.cards.map(c => `${c.name}|${c.setCode}|${c.setNumber}`));

    for (const card of unknownCards) {
      const key = `${card.name}|${card.setCode}|${card.setNumber}`;
      if (!existingKeys.has(key)) {
        existingData.cards.push({
          name: card.name,
          setCode: card.setCode,
          setNumber: card.setNumber,
          fullName: card.fullName,
          importLine: `${card.quantity} ${card.name} ${card.setCode} ${card.setNumber}`,
          addedAt: new Date().toISOString()
        });
        existingKeys.add(key);
      }
    }

    existingData.lastUpdated = new Date().toISOString();

    // Ensure directory exists
    const dir = join(__dirname, '../../../data');
    if (!existsSync(dir)) {
      const { mkdirSync } = require('fs');
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(UNKNOWN_CARDS_FILE, JSON.stringify(existingData, null, 2), 'utf-8');
  }
}
