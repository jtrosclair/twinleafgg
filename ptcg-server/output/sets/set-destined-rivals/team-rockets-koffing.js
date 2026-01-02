"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsKoffing = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class TeamRocketsKoffing extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Alert Smog',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), search your deck for up to 2 Pokémon with Koffing in their name and put them onto your Bench. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Gas Leak',
                cost: [D, C],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.name = 'Team Rocket\'s Koffing';
        this.fullName = 'Team Rocket\'s Koffing DRI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.getPokemonCard() === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0 || openSlots.length === 0) {
                return state;
            }
            store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: this.name });
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    const maxPokemons = Math.min(openSlots.length, 2);
                    const blocked = [];
                    player.deck.cards.forEach((card, index) => {
                        if (!card.name.includes('Koffing')) {
                            blocked.push(index);
                        }
                    });
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: Math.min(2, maxPokemons), allowCancel: false, blocked }), selectedCards => {
                        const cards = selectedCards || [];
                        cards.forEach((card, index) => {
                            player.deck.moveCardTo(card, openSlots[index]);
                            openSlots[index].pokemonPlayedTurn = state.turn;
                        });
                        prefabs_1.SHUFFLE_DECK(store, state, player);
                    });
                }
            });
        }
        return state;
    }
}
exports.TeamRocketsKoffing = TeamRocketsKoffing;
