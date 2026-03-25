"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flapple = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Flapple extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 80;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Acidic Mucus',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 50 damage for each of your opponent\'s Pokémon in play that has an Ability.'
            },
            {
                name: 'Fighting Tackle',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.FIRE],
                damage: 80,
                text: 'If your opponent\'s Active Pokémon is a Pokémon V, this attack does 80 more damage.'
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Flapple';
        this.fullName = 'Flapple EVS';
        this.evolvesFrom = 'Applin';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let abilityCount = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (cardList.getPokemonCard()) {
                    const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, card);
                    state = store.reduceEffect(state, powersEffect);
                    if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                        abilityCount++;
                    }
                }
            });
            effect.damage += abilityCount * 50;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.getPokemonCard() &&
                (opponent.active.getPokemonCard().tags.includes(card_types_1.CardTag.POKEMON_V) ||
                    opponent.active.getPokemonCard().tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                    opponent.active.getPokemonCard().tags.includes(card_types_1.CardTag.POKEMON_VSTAR))) {
                effect.damage += 80;
            }
            return state;
        }
        return state;
    }
}
exports.Flapple = Flapple;
