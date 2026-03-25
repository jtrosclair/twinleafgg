"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ludicolo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ludicolo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lombre';
        this.cardType = G;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Excited Healing',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if you have any [G] Mega Evolution Pokémon ex in play, you may use this Ability. Heal 60 damage from 1 of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Lunge Out',
                cost: [G, C],
                damage: 120,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Ludicolo';
        this.fullName = 'Ludicolo M2';
        this.EXCITED_HEALING_MARKER = 'EXCITED_HEALING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasMegaEvolutionPokemonInPlay = player.active.cards.some(c => {
                return c instanceof pokemon_card_1.PokemonCard
                    && c.tags.includes(card_types_1.CardTag.POKEMON_ex)
                    && c.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA)
                    && c.cardType === card_types_1.CardType.GRASS;
            });
            if (!hasMegaEvolutionPokemonInPlay) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage === 0) {
                    blocked.push(target);
                }
            });
            const hasPokeBenchWithDamage = player.bench.some(b => b.damage > 0);
            const hasActiveWIthDamage = player.active.damage > 0;
            const pokemonInPlayWithDamage = hasPokeBenchWithDamage || hasActiveWIthDamage;
            if (player.marker.hasMarker(this.EXCITED_HEALING_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (!pokemonInPlayWithDamage) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let targets = [];
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), results => {
                targets = results || [];
                if (targets.length === 0) {
                    return state;
                }
                player.marker.addMarker(this.EXCITED_HEALING_MARKER, this);
                targets.forEach(target => {
                    // Heal Pokemon
                    const healEffect = new game_effects_1.HealEffect(player, target, 60);
                    store.reduceEffect(state, healEffect);
                });
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                return state;
            });
        }
        return state;
    }
}
exports.Ludicolo = Ludicolo;
