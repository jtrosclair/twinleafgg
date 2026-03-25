"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkFlaaffy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DarkFlaaffy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mareep';
        this.tags = [card_types_1.CardTag.DARK];
        this.cardType = L;
        this.additionalCardTypes = [D];
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Thunder Slash',
                cost: [C],
                damage: 10,
                text: 'If the Defending Pokémon is a Basic Pokémon, the Defending Pokémon is now Paralyzed. Dark Flaaffy can\'t use Thunder Slash during your next turn.'
            },
            {
                name: 'Headbutt',
                cost: [L, C],
                damage: 20,
                text: ''
            }];
        this.set = 'TRR';
        this.setNumber = '33';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Flaaffy';
        this.fullName = 'Dark Flaaffy TRR';
    }
    reduceEffect(store, state, effect) {
        // Handle Thunder Slash attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const defendingPokemon = opponent.active.getPokemonCard();
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Thunder Slash')) {
                player.active.cannotUseAttacksNextTurnPending.push('Thunder Slash');
            }
            // Check if defending Pokémon is Basic
            if (defendingPokemon && defendingPokemon.stage === card_types_1.Stage.BASIC) {
                const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                store.reduceEffect(state, specialConditionEffect);
            }
        }
        return state;
    }
}
exports.DarkFlaaffy = DarkFlaaffy;
