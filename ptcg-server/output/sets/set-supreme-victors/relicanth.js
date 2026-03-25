"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relicanth = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Relicanth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: G, value: +20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Grand Swell',
                cost: [F],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon for each Pokémon Tool and Stadium card your opponent has in play. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Amnesia',
                cost: [F, C],
                damage: 30,
                text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
            }];
        this.set = 'SV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Relicanth';
        this.fullName = 'Relicanth SV';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            let attackDamage = 0;
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard) {
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const stadiumOwner = game_1.StateUtils.findOwner(state, cardList);
                if (stadiumOwner === effect.opponent) {
                    attackDamage += 30;
                }
            }
            effect.opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.cards.forEach(card => {
                    if (card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.TOOL) {
                        attackDamage += 30;
                    }
                });
            });
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(attackDamage, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
                return state;
            }
            store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_DISABLE, [pokemonCard], { allowCancel: false }), result => {
                result;
                if (!result) {
                    return state;
                }
                this.MEMORY_SKIPPED_ATTACK = result;
                store.log(state, game_1.GameLog.LOG_PLAYER_DISABLES_ATTACK, {
                    name: player.name,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    attack: this.MEMORY_SKIPPED_ATTACK.name
                });
                opponent.active.marker.addMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
                return state;
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            if (effect.attack === this.MEMORY_SKIPPED_ATTACK) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            this.MEMORY_SKIPPED_ATTACK = undefined;
        }
        return state;
    }
}
exports.Relicanth = Relicanth;
