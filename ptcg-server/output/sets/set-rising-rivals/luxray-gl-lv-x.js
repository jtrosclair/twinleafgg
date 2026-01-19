"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuxrayGLLVX = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class LuxrayGLLVX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LV_X;
        this.evolvesFrom = 'Luxray GL';
        this.cardType = L;
        this.tags = [card_types_1.CardTag.POKEMON_LV_X, card_types_1.CardTag.POKEMON_SP];
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [];
        this.powers = [
            {
                name: 'LV.X Rule',
                powerType: game_1.PowerType.LV_X_RULE,
                text: 'Put this card onto your Active Luxray GL. Luxray GL LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
            },
            {
                name: 'Bright Look',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), when you put Luxray GL LV.X from your hand onto your Active Luxray GL, you may switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
            }
        ];
        this.attacks = [{
                name: 'Flash Impact',
                cost: [L, C],
                damage: 60,
                text: 'Does 30 damage to 1 of your Pokémon, and don\'t apply Weakness and Resistance to this damage.'
            }];
        this.set = 'RR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Luxray GL';
        this.fullName = 'Luxray GL LV.X RR';
    }
    reduceEffect(store, state, effect) {
        // Bright Look
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEPOWER,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const player = effect.player;
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    const hasBench = opponent.bench.some(b => b.cards.length > 0);
                    if (!hasBench) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                    }
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                        const cardList = result[0];
                        opponent.switchPokemon(cardList);
                        return state;
                    });
                }
                else {
                    return state;
                }
            });
        }
        // Flash Impact
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        // making sure it gets put on the active pokemon
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target !== effect.player.active) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Trying to get all of the previous stage's attacks and powers
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                    player.showAllStageAbilities = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // Add attacks from the previous stage to this one
            for (const evolutionCard of cardList.cards) {
                if (evolutionCard.superType === card_types_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
                    effect.attacks.push(...(evolutionCard.attacks || []));
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // Adds the powers from the previous stage
            for (const evolutionCard of cardList.cards) {
                if (evolutionCard.superType === card_types_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
                    effect.powers.push(...(evolutionCard.powers || []));
                }
            }
        }
        return state;
    }
}
exports.LuxrayGLLVX = LuxrayGLLVX;
