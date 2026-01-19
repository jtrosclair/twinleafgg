"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blastoise = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Blastoise extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Wartortle';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = F;
        this.additionalCardTypes = [M];
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Shield Veil',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Each of your Active Pokémon has no Weakness.'
            }];
        this.attacks = [{
                name: 'Enraged Linear Attack',
                cost: [F, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage for each damage counter on Blastoise to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Skull Bash',
                cost: [M, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'CG';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Blastoise';
        this.fullName = 'Blastoise CG';
        this.AGILITY_MARKER = 'AGILITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Shield Veil
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            let hasBlastoiseInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasBlastoiseInPlay = true;
                }
            });
            if (!hasBlastoiseInPlay) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (game_1.StateUtils.findOwner(state, effect.target) === player && effect.target === player.active) {
                effect.weakness = [];
            }
        }
        // Enraged Linear Attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(effect.player.active.damage, effect, store, state);
        }
        return state;
    }
}
exports.Blastoise = Blastoise;
