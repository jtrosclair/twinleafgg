"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsZapdos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsZapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Jamming Wave',
                cost: [C, C],
                damage: 30,
                text: 'You may move an Energy from your opponent\'s Active Pokémon to 1 of their Benched Pokémon.'
            },
            {
                name: 'Bad Thunder',
                cost: [L, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If this Pokémon has Team Rocket Energy attached, this attack does 60 more damage.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Zapdos';
        this.fullName = 'Team Rocket\'s Zapdos DRI';
    }
    reduceEffect(store, state, effect) {
        // Jamming Wave
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    if (!opponent.bench.some(b => b.cards.length > 0)) {
                        return state;
                    }
                    if (!opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                        return state;
                    }
                    return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, opponent.active, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                        transfers = transfers || [];
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, opponent, transfer.to);
                            opponent.active.moveCardTo(transfer.card, target);
                        }
                    });
                }
            });
        }
        // Bad Thunder
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.name === 'Team Rocket Energy')) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.TeamRocketsZapdos = TeamRocketsZapdos;
