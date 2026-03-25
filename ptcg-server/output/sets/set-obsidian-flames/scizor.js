"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scizor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scizor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scyther';
        this.cardType = M;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Punishing Scissors',
                cost: [M],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each of your opponent\'s Pokémon in play that has an Ability.'
            },
            {
                name: 'Cut',
                cost: [M, M],
                damage: 70,
                text: ''
            }];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.name = 'Scizor';
        this.fullName = 'Scizor OBF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let pokemonWithUsableAbilities = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (cardList.getPokemonCard()) {
                    const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, card);
                    state = store.reduceEffect(state, powersEffect);
                    if (powersEffect.powers.some(power => power.powerType === pokemon_types_1.PowerType.ABILITY)) {
                        pokemonWithUsableAbilities++;
                    }
                }
            });
            effect.damage += pokemonWithUsableAbilities * 50;
            return state;
        }
        return state;
    }
}
exports.Scizor = Scizor;
