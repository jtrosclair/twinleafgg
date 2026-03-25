"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegigigasLVX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RegigigasLVX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.LV_X;
        this.evolvesFrom = 'Regigigas';
        this.tags = [game_1.CardTag.POKEMON_LV_X];
        this.cardType = C;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Sacrifice',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may choose 1 of your Pokémon in play and that Pokémon is Knocked Out. Then, search your discard pile for up to 2 basic Energy cards, attach them to Regigigas, and remove 8 damage counters from Regigigas. This power can\'t be used if Regigigas is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Giga Blaster',
                cost: [W, F, M, C],
                damage: 100,
                text: 'Discard the top card from your opponent\'s deck. Then, choose 1 card from your opponent\'s hand without looking and discard it. Regigigas can\'t use Giga Blaster during your next turn.'
            }];
        this.set = 'SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Regigigas';
        this.fullName = 'Regigigas Lv. X SF';
        this.SACRIFICE_MARKER = 'SACRIFICE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-ex-deoxys/camerupt.ts (Back Burner), set-triumphant/electrode.ts (Energymite)
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_EFFECT_IF_MARKER)(this.SACRIFICE_MARKER, player, this);
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.SACRIFICE_MARKER, player, this);
            const regigigasCardList = game_1.StateUtils.findCardList(state, this);
            // Choose 1 of your Pokémon in play to Knock Out
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length === 0) {
                    return state;
                }
                const chosenCardList = targets[0];
                // Move attached cards (energy, tools) to discard before KO
                const pokemons = chosenCardList.getPokemons();
                const attachedCards = chosenCardList.cards.filter(c => !pokemons.includes(c));
                const tools = chosenCardList.tools.slice();
                attachedCards.forEach(c => chosenCardList.moveCardTo(c, player.discard));
                tools.forEach(c => chosenCardList.moveCardTo(c, player.discard));
                // Mark chosen Pokémon for KO
                chosenCardList.damage += 999;
                // Search discard pile for up to 2 basic Energy cards, attach them to Regigigas
                const hasBasicEnergy = player.discard.cards.some(c => c.superType === game_1.SuperType.ENERGY && c.energyType === game_1.EnergyType.BASIC);
                if (!hasBasicEnergy) {
                    // Still remove 8 damage counters from Regigigas
                    const healEffect = new game_effects_1.HealEffect(player, regigigasCardList, 80);
                    store.reduceEffect(state, healEffect);
                    return state;
                }
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), cards => {
                    cards = cards || [];
                    cards.forEach(card => {
                        player.discard.moveCardTo(card, regigigasCardList);
                    });
                    // Remove 8 damage counters from Regigigas
                    const healEffect = new game_effects_1.HealEffect(player, regigigasCardList, 80);
                    store.reduceEffect(state, healEffect);
                });
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SACRIFICE_MARKER, this);
        // Giga Blaster
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.DISCARD_TOP_X_OF_OPPONENTS_DECK)(store, state, effect.player, 1, this, this.attacks[0]);
            const opponent = effect.opponent;
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                (0, prefabs_1.MOVE_CARD_TO)(state, randomCard, opponent.discard);
            }
            (0, prefabs_1.THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN)(effect.player, this.attacks[0]);
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
exports.RegigigasLVX = RegigigasLVX;
