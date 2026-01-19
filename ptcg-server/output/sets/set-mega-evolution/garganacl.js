"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garganacl = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Garganacl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Naclstack';
        this.cardType = F;
        this.hp = 180;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Power Salt',
                powerType: game_1.PowerType.ABILITY,
                text: 'Attacks used by your [F] Pokémon do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Rock Hurl',
                cost: [F, F, C],
                damage: 130,
                text: ''
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Garganacl';
        this.fullName = 'Garganacl M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const hasGarganaclInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
            let numberOfGarganaclInPlay = 0;
            if (hasGarganaclInPlay) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList.cards.includes(this)) {
                        numberOfGarganaclInPlay++;
                    }
                });
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIGHTING) && effect.target === opponent.active) {
                effect.damage += 30 * numberOfGarganaclInPlay;
            }
        }
        return state;
    }
}
exports.Garganacl = Garganacl;
