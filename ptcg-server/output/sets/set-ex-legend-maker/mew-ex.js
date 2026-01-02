"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mewex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mewex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Versatile',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEBODY,
                text: 'Mew ex can use the attacks of all Pokémon in play as its own. (You still need the necessary Energy to use each attack.)'
            }];
        this.attacks = [
            {
                name: 'Power Move',
                cost: [P, C],
                damage: 0,
                text: 'Search your deck for an Energy card and attach it to Mew ex. Shuffle your deck afterward. Then, you may switch Mew ex with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'LM';
        this.name = 'Mew ex';
        this.fullName = 'Mew ex LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
    }
    reduceEffect(store, state, effect) {
        //Versatile pokebody
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.ABILITY_BLOCKED);
            }
            // Build cards and blocked for Choose Attack prompt
            const { pokemonCards, blocked } = this.buildAttackList(state, store, player);
            // No attacks to copy
            if (pokemonCards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, { allowCancel: true, blocked }), attack => {
                if (attack !== null) {
                    const useAttackEffect = new game_effects_1.UseAttackEffect(player, attack);
                    store.reduceEffect(state, useAttackEffect);
                }
            });
        }
        //Power Move attack
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                // Attach energy if selected
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    prefabs_1.MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
                }
                // Shuffle the deck after attaching energy
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
                // Prompt to switch Mew ex with a Benched Pokémon
                prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                    if (result) {
                        prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
                    }
                });
            });
        }
        return state;
    }
    buildAttackList(state, store, player) {
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyMap = checkProvidedEnergyEffect.energyMap;
        const pokemonCards = [];
        const blocked = [];
        // Check player's Pokemon
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
        });
        // Check opponent's Pokemon
        const opponent = game_1.StateUtils.getOpponent(state, player);
        opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
        });
        return { pokemonCards, blocked };
    }
    checkAttack(state, store, player, card, energyMap, pokemonCards, blocked) {
        // No need to include Mew ex to the list
        if (card instanceof Mewex) {
            return;
        }
        const attacks = card.attacks.filter(attack => {
            const checkAttackCost = new check_effects_1.CheckAttackCostEffect(player, attack);
            state = store.reduceEffect(state, checkAttackCost);
            return game_1.StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost);
        });
        const index = pokemonCards.length;
        pokemonCards.push(card);
        card.attacks.forEach(attack => {
            if (!attacks.includes(attack)) {
                blocked.push({ index, attack: attack.name });
            }
        });
    }
}
exports.Mewex = Mewex;
