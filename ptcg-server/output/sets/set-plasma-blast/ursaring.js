"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ursaring = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ursaring extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Teddiursa';
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Adrenalash',
                cost: [C, C, C],
                damage: 50,
                text: 'During your next turn, each of this Pokémon\'s attacks does 50 more damage (before applying Weakness and Resistance).'
            },
            {
                name: 'Strength',
                cost: [C, C, C, C],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '76';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ursaring';
        this.fullName = 'Ursaring PLB';
        this.ADRENALASH_MARKER = 'ADRENALASH_MARKER';
        this.CLEAR_ADRENALASH_MARKER = 'CLEAR_ADRENALASH_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Check for bonus damage on ANY attack from this Pokemon
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const cardList = player.active;
            if ((0, prefabs_1.HAS_MARKER)(this.ADRENALASH_MARKER, cardList, this)) {
                effect.damage += 50;
            }
        }
        // Attack 1: Adrenalash - set marker for next turn bonus
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.ADD_MARKER)(this.ADRENALASH_MARKER, player.active, this);
        }
        // Two-marker pattern: marker persists through our next turn, then is cleared
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    if ((0, prefabs_1.HAS_MARKER)(this.CLEAR_ADRENALASH_MARKER, cardList, this)) {
                        (0, prefabs_1.REMOVE_MARKER)(this.ADRENALASH_MARKER, cardList, this);
                        (0, prefabs_1.REMOVE_MARKER)(this.CLEAR_ADRENALASH_MARKER, cardList, this);
                    }
                    else if ((0, prefabs_1.HAS_MARKER)(this.ADRENALASH_MARKER, cardList, this)) {
                        (0, prefabs_1.ADD_MARKER)(this.CLEAR_ADRENALASH_MARKER, cardList, this);
                    }
                }
            });
        }
        return state;
    }
}
exports.Ursaring = Ursaring;
