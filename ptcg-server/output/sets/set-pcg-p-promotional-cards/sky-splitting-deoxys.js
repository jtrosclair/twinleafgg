"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkySplittingDeoxys = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SkySplittingDeoxys extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Duplicate',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may search your deck for another Sky-Splitting Deoxys and switch it with Sky-Splitting Deoxys. (Any cards attached to Sky-Splitting Deoxys, damage counters, Special Conditions, and effects on it are now on the new Pokémon.) If you do, put Sky-Splitting Deoxys on top of your deck. Shuffle your deck afterward. You can\'t use more than 1 Forme Change Poké-Power each turn.'
            }];
        this.attacks = [{
                name: 'Ozone Drain',
                cost: [P, C, C],
                damage: 40,
                text: 'If Magnetic Storm is in play, remove 3 damage counters from Sky-Splitting Deoxys.'
            }];
        this.set = 'PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Sky-Splitting Deoxys';
        this.fullName = 'Sky-Splitting Deoxys PCGP';
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
        // Ozone Drain
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard && stadiumCard.name === 'Magnetic Storm') {
                prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
            }
        }
        return state;
    }
}
exports.SkySplittingDeoxys = SkySplittingDeoxys;
