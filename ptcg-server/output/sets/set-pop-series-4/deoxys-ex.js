"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deoxysex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Deoxysex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Form Change',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may search your deck for another Deoxys ex and switch it with Deoxys ex. (Any cards attached to Deoxys ex, damage counters, Special Conditions, and effects on it are now on the new Pokémon.) If you do, put Deoxys ex on top of your deck. Shuffle your deck afterward. You can\'t use more than 1 Form Change Poké-Power each turn.'
            }];
        this.attacks = [{
                name: 'Fastwave',
                cost: [C, C, C],
                damage: 50,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
            }];
        this.set = 'P4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Deoxys ex';
        this.fullName = 'Deoxys ex P4';
        this.FORME_CHANGE_MARKER = 'FORME_CHANGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.FORME_CHANGE_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const targetCardList = game_1.StateUtils.findCardList(state, this);
            if (!(targetCardList instanceof game_1.PokemonCardList)) {
                throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
            }
            if (prefabs_1.HAS_MARKER(this.FORME_CHANGE_MARKER, player)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.name !== this.name) {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked }), (selection) => {
                if (selection.length <= 0) {
                    return state;
                }
                const pokemonCard = selection[0];
                if (!(pokemonCard instanceof pokemon_card_1.PokemonCard)) {
                    return state;
                }
                store.log(state, game_1.GameLog.LOG_PLAYER_TRANSFORMS_INTO_POKEMON, {
                    name: player.name,
                    pokemon: this.name,
                    card: pokemonCard.name,
                    effect: effect.power.name,
                });
                player.deck.moveCardTo(pokemonCard, targetCardList);
                targetCardList.moveCardTo(this, player.deck);
                prefabs_1.SHUFFLE_DECK(store, state, player);
                prefabs_1.ADD_MARKER(this.FORME_CHANGE_MARKER, player, this);
            });
        }
        // Fastwave
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 50);
        }
        return state;
    }
}
exports.Deoxysex = Deoxysex;
