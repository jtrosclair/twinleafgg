"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MGardevoirEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MGardevoirEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA];
        this.stage = card_types_1.Stage.MEGA;
        this.evolvesFrom = 'Gardevoir-EX';
        this.cardType = Y;
        this.additionalCardTypes = [P];
        this.hp = 210;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Mega Evolution Rule',
                powerType: game_1.PowerType.MEGA_EVOLUTION_RULE,
                text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
            }
        ];
        this.attacks = [
            {
                name: 'Despair Ray',
                cost: [Y, C],
                damage: 110,
                damageCalculation: '+',
                text: 'Discard as many of your Benched Pokémon as you like. This attack does 10 more damage for each Benched Pokémon you discarded in this way.'
            }
        ];
        this.set = 'STS';
        this.name = 'M Gardevoir-EX';
        this.fullName = 'M Gardevoir-EX STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
    }
    reduceEffect(store, state, effect) {
        // screw the rules
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Gardevoir Spirit Link') {
                return state;
            }
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(effect.player);
            store.reduceEffect(state, endTurnEffect);
        }
        // Despair Ray
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            // Player has more Pokemons than bench size, discard some
            const count = player.bench.length;
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 0, max: count, allowCancel: false }), results => {
                results = results || [];
                let discardCount = 0;
                // Discard all selected Pokemon
                for (let i = player.bench.length - 1; i >= 0; i--) {
                    if (results.includes(player.bench[i])) {
                        const cardList = player.bench[i];
                        const pokemons = cardList.getPokemons();
                        const otherCards = cardList.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                            !pokemons.includes(card) &&
                            (!cardList.tools || !cardList.tools.includes(card)));
                        const tools = [...cardList.tools];
                        // Move other cards (tools, energy, etc.) to discard
                        if (otherCards.length > 0) {
                            prefabs_1.MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
                        }
                        // Move tools to discard
                        if (tools.length > 0) {
                            for (const tool of tools) {
                                cardList.moveCardTo(tool, player.discard);
                            }
                        }
                        // Move Pokémon to discard and clear their effects
                        if (pokemons.length > 0) {
                            cardList.damage = 0;
                            cardList.clearEffects();
                            prefabs_1.MOVE_CARDS(store, state, cardList, player.discard, { cards: pokemons });
                        }
                        discardCount++;
                    }
                }
                effect.damage += (10 * discardCount);
            });
        }
        return state;
    }
}
exports.MGardevoirEx = MGardevoirEx;
