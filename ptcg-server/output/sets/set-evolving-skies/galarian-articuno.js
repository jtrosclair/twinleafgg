"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianArticuno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GalarianArticuno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Cruel Charge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may attach up to 2 [P] Energy cards from your hand to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Psylaser',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard all [P] Energy from this Pokémon. This attack does 120 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Galarian Articuno';
        this.fullName = 'Galarian Articuno EVS';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof play_card_effects_1.PlayPokemonEffect) && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const hasEnergyInHand = player.hand.cards.some(c => {
                        return c instanceof game_1.EnergyCard
                            && c.energyType === card_types_1.EnergyType.BASIC
                            && c.provides.includes(card_types_1.CardType.PSYCHIC);
                    });
                    if (!hasEnergyInHand) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    const cardList = game_1.StateUtils.findCardList(state, this);
                    if (cardList === undefined) {
                        return state;
                    }
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { min: 0, max: 2, allowCancel: false }), cards => {
                        cards = cards || [];
                        if (cards.length > 0) {
                            player.hand.moveCardsTo(cards, cardList);
                        }
                    });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            checkProvidedEnergy.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.PSYCHIC) || em.provides.includes(card_types_1.CardType.ANY)) {
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, [em.card]);
                    discardEnergy.target = player.active;
                    store.reduceEffect(state, discardEnergy);
                }
            });
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 120, targets);
            });
        }
        return state;
    }
}
exports.GalarianArticuno = GalarianArticuno;
