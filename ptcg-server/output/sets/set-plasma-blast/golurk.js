"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golurk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Golurk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Golett';
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: D }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Iron Fist of Justice',
                cost: [C, C],
                damage: 60,
                text: 'If you have any Team Plasma Pokémon in play, this attack does nothing.'
            },
            {
                name: 'Shadow Punch',
                cost: [P, P, C, C],
                damage: 80,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '46';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Golurk';
        this.fullName = 'Golurk PLB';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Iron Fist of Justice
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let hasTeamPlasma = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                    hasTeamPlasma = true;
                }
            });
            if (hasTeamPlasma) {
                effect.damage = 0;
            }
        }
        // Attack 2: Shadow Punch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Golurk = Golurk;
