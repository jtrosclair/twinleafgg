"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sinistcha = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const ghost_veil_1 = require("./ghost-veil");
class Sinistcha extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Poltchageist';
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Ghost Veil',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon can\'t be affected by effects of attacks or Abilities from your opponent\'s Pokémon.',
            }];
        this.attacks = [{
                name: 'Matcha Spin',
                cost: [C],
                damage: 0,
                text: 'If you have 6 or more Pokémon in your discard with the Ghost Veil Ability, place 4 damage counters on each of your opponent\'s Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '6';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sinistcha';
        this.fullName = 'Sinistcha M5';
    }
    reduceEffect(store, state, effect) {
        (0, ghost_veil_1.reduceGhostVeil)(store, state, effect, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            effect.damage = 0;
            if ((0, ghost_veil_1.countGhostVeilPokemonInDiscard)(player) < 6) {
                return state;
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                if (cardList.cards.length === 0) {
                    return;
                }
                const counters = new game_effects_1.PlaceDamageCountersEffect(player, cardList, 40, this);
                store.reduceEffect(state, counters);
            });
        }
        return state;
    }
}
exports.Sinistcha = Sinistcha;
