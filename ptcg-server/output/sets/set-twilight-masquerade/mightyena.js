"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mightyena = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mightyena extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Poochyena';
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hunting Pack',
                cost: [D],
                damage: 30,
                damageCalculation: '+',
                text: 'If Mightyena is on your Bench, this attack does 90 more damage.'
            },
            {
                name: 'Corner',
                cost: [D, C],
                damage: 60,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '114';
        this.name = 'Mightyena';
        this.fullName = 'Mightyena TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
            const mightyenasOnBench = benchPokemon.filter(card => card.name === 'Mightyena');
            if (mightyenasOnBench.length > 0) {
                effect.damage += 90;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Mightyena = Mightyena;
