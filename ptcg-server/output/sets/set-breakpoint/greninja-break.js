"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreninjaBREAK = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GreninjaBREAK extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BREAK;
        this.tags = [card_types_1.CardTag.BREAK];
        this.evolvesFrom = 'Greninja';
        this.cardType = W;
        this.hp = 170;
        this.powers = [
            {
                name: 'BREAK Evolution Rule',
                powerType: game_1.PowerType.BREAK_RULE,
                text: 'Greninja BREAK retains the attacks, Abilities, Weakness, Resistance, and Retreat Cost of its previous Evolution.'
            },
            {
                name: 'Giant Water Shuriken',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may discard a [W] Energy card from your hand. If you do, put 6 damage counters on 1 of your opponent\'s Pokémon.'
            }
        ];
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Greninja BREAK';
        this.fullName = 'Greninja BREAK BKP';
        this.GIANT_WATER_SHURIKEN_MARKER = 'GIANT_WATER_SHURIKEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Giant Water Shuriken
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 1, this)) {
            const player = effect.player;
            // Check marker
            if (player.marker.hasMarker(this.GIANT_WATER_SHURIKEN_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            let waterInHand = false;
            player.hand.cards.forEach(card => {
                if (card.superType === card_types_1.SuperType.ENERGY && card.name === 'Water Energy') {
                    waterInHand = true;
                }
            });
            if (!waterInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, name: 'Water Energy' }, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                player.marker.addMarker(this.GIANT_WATER_SHURIKEN_MARKER, this);
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards, sourceCard: this, sourceEffect: this.powers[1] });
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false }), selected => {
                    const targets = selected || [];
                    if (targets.length > 0) {
                        const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[1], this, targets[0]);
                        store.reduceEffect(state, damageEffect);
                        if (damageEffect.target) {
                            damageEffect.target.damage += 60;
                        }
                    }
                });
            });
            return state;
        }
        // slapping on the weakness, resistance, and retreat of the previous evolutions
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const cardList = effect.target;
            const previousPokemon = cardList.getPokemonCard();
            if (previousPokemon) {
                this.weakness = [...previousPokemon.weakness];
                this.resistance = [...previousPokemon.resistance];
                this.retreat = [...previousPokemon.retreat];
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
                    // Create a deep copy of each attack to ensure we don't modify the original
                    const inheritedAttacks = evolutionCard.attacks.map(attack => ({
                        name: attack.name,
                        cost: [...attack.cost],
                        damage: attack.damage,
                        text: attack.text
                    }));
                    effect.attacks.push(...inheritedAttacks);
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
            // Add this card's own powers
            effect.powers.push(...this.powers);
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
exports.GreninjaBREAK = GreninjaBREAK;
