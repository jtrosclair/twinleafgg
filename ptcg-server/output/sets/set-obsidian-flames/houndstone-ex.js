"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndstoneex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Houndstoneex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Greavard';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 260;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Big Bite',
                cost: [P],
                damage: 30,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            },
            {
                name: 'Last Respects',
                cost: [P, C, C],
                damage: 160,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each [P] Pokémon in your discard pile.'
            }];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Houndstone ex';
        this.fullName = 'Houndstone ex OBF';
    }
    reduceEffect(store, state, effect) {
        // Big Bite
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            return prefabs_1.BLOCK_RETREAT(store, state, effect, this);
        }
        prefabs_1.BLOCK_RETREAT_IF_MARKER(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        // Last Respects
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            let psychicsInDiscard = 0;
            player.discard.cards.forEach(card => { if (card instanceof pokemon_card_1.PokemonCard && card.cardType === P) {
                psychicsInDiscard++;
            } });
            effect.damage += psychicsInDiscard * 10;
        }
        return state;
    }
}
exports.Houndstoneex = Houndstoneex;
