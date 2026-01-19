"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kingdra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Kingdra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.PRIME];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Seadra';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Spray Splash',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may put 1 damage counter on 1 of your opponent\'s Pokémon.This power can\'t be used if Kingdra is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Dragon Steam ',
                cost: [W],
                damage: 60,
                text: 'If your opponent has any [R] Pokémon in play, this attack\'s base damage is 20 instead of 60.'
            }];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Kingdra';
        this.fullName = 'Kingdra UL';
        this.SPRAY_SPLASH_MARKER = 'SPRAY_SPLASH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SPRAY_SPLASH_MARKER, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SPRAY_SPLASH_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.SPRAY_SPLASH_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length > 0) {
                    const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, targets[0]);
                    store.reduceEffect(state, damageEffect);
                    if (damageEffect.target) {
                        damageEffect.target.damage += 10;
                    }
                }
                player.marker.addMarker(this.SPRAY_SPLASH_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let hasFire = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, pokemon) => {
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonType);
                if (checkPokemonType.cardTypes.includes(card_types_1.CardType.FIRE)) {
                    hasFire = true;
                }
            });
            if (hasFire) {
                effect.damage = 20;
            }
        }
        return state;
    }
}
exports.Kingdra = Kingdra;
