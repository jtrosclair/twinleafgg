"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzelfLVX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AzelfLVX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.LV_X;
        this.evolvesFrom = 'Azelf';
        this.tags = [game_1.CardTag.POKEMON_LV_X];
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Psychic Aura',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Each of your [P] Pokémon has no Weakness.'
            }];
        this.attacks = [{
                name: 'Deep Balance',
                cost: [P],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. Put 1 damage counter on that Pokémon for each Energy attached to all of your opponent\'s Pokémon.'
            }];
        this.set = 'LA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '140';
        this.name = 'Azelf';
        this.fullName = 'Azelf Lv. X LA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            let isAzelfInPlay = false;
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isAzelfInPlay = true;
                }
            });
            if (isAzelfInPlay && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (checkPokemonTypeEffect.cardTypes.includes(game_1.CardType.PSYCHIC)) {
                    effect.weakness = [];
                }
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // get the energies from the opponent's pokemon
            let energies = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies += energy.provides.length;
                });
            });
            if (energies === 0) {
                return state;
            }
            // choose and put the counters on the chosen pokemon
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { max: 1, allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, energies * 10);
                putCountersEffect.target = targets[0];
                store.reduceEffect(state, putCountersEffect);
            });
        }
        //Lv. X Stuff
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
                if (evolutionCard.superType === game_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
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
                if (evolutionCard.superType === game_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
                    effect.powers.push(...(evolutionCard.powers || []));
                }
            }
        }
        return state;
    }
}
exports.AzelfLVX = AzelfLVX;
