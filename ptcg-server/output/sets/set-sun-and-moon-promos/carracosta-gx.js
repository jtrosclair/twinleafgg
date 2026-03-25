"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarracostaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class CarracostaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Tirtouga';
        this.cardType = F;
        this.hp = 250;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'High Density Armor',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has full HP, it takes 90 less damage from your opponent\'s attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Ground Crush',
                cost: [F, C, C, C],
                damage: 160,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Stone Age-GX',
                cost: [C],
                damage: 0,
                text: 'Put any number of Pokémon that evolve from Unidentified Fossil from your discard pile onto your Bench. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.set = 'SMP';
        this.setNumber = '239';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Carracosta-GX';
        this.fullName = 'Carracosta-GX SMP';
    }
    reduceEffect(store, state, effect) {
        // Crimson Armor
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            // i love checking for ability lock woooo
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            // checking damage (it having no damage should confirm that this has full hp, no matter what its hp is set to)
            if (effect.target.damage === 0) {
                effect.damage -= 80;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.usedGX) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            // Allow player to search deck and choose up to 2 Basic Pokemon
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.discard.cards.length === 0) {
                return state;
            }
            // Check if bench has open slots
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { evolvesFrom: 'Unidentified Fossil' }, { min: 0, max: openSlots.length, allowCancel: false }), selectedCards => {
                cards = selectedCards || [];
                cards.forEach((card, index) => {
                    player.discard.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
            });
        }
        return state;
    }
}
exports.CarracostaGX = CarracostaGX;
