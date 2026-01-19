"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mew = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Mew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Copy',
                cost: [C],
                damage: 0,
                text: 'Choose 1 of the Defending Pokémon\'s attacks. Copy copies that attack. This attack does nothing if Mew doesn\'t have the Energy necessary to use that attack. (You must still do anything else required for that attack.) Mew performs that attack.'
            },
            {
                name: 'Extra Draw',
                cost: [R],
                damage: 0,
                text: 'If your opponent has any Pokémon-ex in play, search your deck for up to 2 basic Energy cards and attach them to Mew. Shuffle your deck afterward.'
            }
        ];
        this.set = 'P5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Mew';
        this.fullName = 'Mew P5';
    }
    reduceEffect(store, state, effect) {
        // Copy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Build cards and blocked for Choose Attack prompt
            const { pokemonCards, blocked } = this.buildAttackList(state, store, player);
            // No attacks to copy
            if (pokemonCards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, { allowCancel: true, blocked }), attack => {
                if (attack !== null) {
                    const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
                    store.reduceEffect(state, attackEffect);
                    if (attackEffect.damage > 0) {
                        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
                        state = store.reduceEffect(state, dealDamage);
                    }
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let hasexPokemon = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const pokemonCard = cardList.getPokemonCard();
                if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    hasexPokemon = true;
                }
            });
            if (hasexPokemon) {
                store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: true }), transfers => {
                    transfers = transfers || [];
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        (0, prefabs_1.MOVE_CARD_TO)(state, transfer.card, target);
                    }
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                });
            }
        }
        return state;
    }
    buildAttackList(state, store, player) {
        const opponent = game_1.StateUtils.getOpponent(state, player);
        const opponentActive = opponent.active.getPokemonCard();
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyMap = checkProvidedEnergyEffect.energyMap;
        const pokemonCards = [];
        const blocked = [];
        if (opponentActive) {
            this.checkAttack(state, store, player, opponentActive, energyMap, pokemonCards, blocked);
        }
        return { pokemonCards, blocked };
    }
    checkAttack(state, store, player, card, energyMap, pokemonCards, blocked) {
        {
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
}
exports.Mew = Mew;
