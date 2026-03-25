"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginFormePalkiaVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class OriginFormePalkiaVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Origin Forme Palkia V';
        this.cardType = W;
        this.hp = 280;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Star Portal',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'During your turn, you may attach up to 3 [W] Energy cards from your discard pile to your [W] Pokémon in any way you like. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.attacks = [
            {
                name: 'Subspace Swell',
                cost: [W, W],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each Benched ' +
                    'Pokémon (both yours and your opponent\'s).'
            }
        ];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Origin Forme Palkia VSTAR';
        this.fullName = 'Origin Forme Palkia VSTAR ASR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.WATER);
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.cardType !== card_types_1.CardType.WATER) {
                    blocked2.push(target);
                }
            });
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: false, min: 1, max: 3, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                player.usedVSTAR = true;
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.powers[0] });
                }
            });
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const totalBenched = playerBenched + opponentBenched;
            effect.damage = 60 + totalBenched * 20;
        }
        return state;
    }
}
exports.OriginFormePalkiaVSTAR = OriginFormePalkiaVSTAR;
