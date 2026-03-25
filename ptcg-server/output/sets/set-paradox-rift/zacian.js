"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zacian = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zacian extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Iron Roar',
                cost: [M],
                damage: 30,
                text: 'Attach a Basic [M] Energy card from your discard pile to 1 of your Benched Pokemon.'
            },
            {
                name: 'Brave Blade',
                cost: [M, M, C],
                damage: 130,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.name = 'Zacian';
        this.fullName = 'Zacian PAR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY && c.provides.includes(M);
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            const blocked = [];
            player.discard.cards.forEach((card, index) => {
                if (card.superType === card_types_1.SuperType.ENERGY && !card.provides.includes(M)) {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1, blocked }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
            return state;
        }
        // Brave Blade
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Zacian = Zacian;
