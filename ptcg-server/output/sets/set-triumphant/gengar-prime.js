"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Gengar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Haunter';
        this.tags = [card_types_1.CardTag.PRIME];
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Catastrophe',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Gengar is your Active Pokémon, if any of your opponent\'s Pokémon would be Knocked Out, put that Pokémon in the Lost Zone instead of discarding it. (Discard all cards attached to that Pokémon.)'
            }];
        this.attacks = [{
                name: 'Hurl into Darkness',
                cost: [P],
                damage: 0,
                text: 'Look at your opponent\'s hand and choose a number of Pokémon you find there up to the number of [P] Energy attached to Gengar. Put the Pokémon you chose in the Lost Zone.'
            },
            {
                name: 'Cursed Drop',
                cost: [P, C],
                damage: 0,
                text: 'Put 4 damage counters on your opponent\'s Pokémon in any way you like.'
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Gengar';
        this.fullName = 'Gengar TM';
        this.LOST_CITY_MARKER = 'LOST_CITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.getPokemonCard() === this && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, opponent, this)) {
                const card = effect.target.getPokemonCard();
                if (card !== undefined && !card.tags.includes(card_types_1.CardTag.PRISM_STAR)) {
                    // Don't prevent default behavior yet - let other cards handle the knockout first
                    // We'll handle moving to lost zone in the game reducer
                    effect.target.marker.addMarker(this.LOST_CITY_MARKER, this);
                }
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // get the Energy attached to Gengar
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            let psychicEnergyCount = 0;
            checkProvidedEnergy.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.PSYCHIC) || em.provides.includes(card_types_1.CardType.ANY)) {
                    psychicEnergyCount++;
                }
            });
            const maxDiscard = Math.min(opponent.hand.cards.length, psychicEnergyCount);
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: maxDiscard, allowCancel: false }), selected => {
                cards = selected || [];
                opponent.hand.moveCardsTo(cards, opponent.lostzone);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(4, store, state, effect);
        }
        return state;
    }
}
exports.Gengar = Gengar;
