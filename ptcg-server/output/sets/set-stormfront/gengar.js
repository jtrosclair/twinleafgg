"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gengar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Haunter';
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: D, value: +30 }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Fainting Spell',
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your opponent\'s turn, if Gengar would be Knocked Out by damage from an attack, you may flip a coin. If heads, the Defending Pokémon is Knocked Out.'
            }];
        this.attacks = [
            {
                name: 'Shadow Room',
                cost: [P],
                damage: 0,
                text: 'Put 3 damage counters on 1 of your opponent\'s Pokémon. If that Pokémon has any Poké-Powers, put 6 damage counters on that Pokémon instead.'
            },
            {
                name: 'Poltergeist',
                cost: [P, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Look at your opponent\'s hand. This attack does 30 damage times the number of Trainer, Supporter, and Stadium cards in your opponent\'s hand.'
            }
        ];
        this.set = 'SF';
        this.setNumber = '18';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gengar';
        this.fullName = 'Gengar SF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            // This Pokemon was knocked out
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_POKEPOWER_BLOCKED(store, state, player, this)) {
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, wantToUse => {
                if (wantToUse) {
                    prefabs_1.COIN_FLIP_PROMPT(store, state, player, flipResult => {
                        if (flipResult) {
                            opponent.active.damage += 999;
                        }
                    });
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                let damageAmount = 30;
                if (targets.some(cardList => {
                    var _a, _b;
                    return ((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.powers)
                        && ((_b = cardList.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.powers.some(power => power.powerType === pokemon_types_1.PowerType.POKEPOWER));
                })) {
                    damageAmount = 60;
                }
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, damageAmount);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof game_1.TrainerCard &&
                    [card_types_1.TrainerType.ITEM, card_types_1.TrainerType.SUPPORTER, card_types_1.TrainerType.STADIUM].includes(card.trainerType)).length;
                const damage = cardsInOpponentHand * 30;
                effect.damage = damage;
            });
        }
        return state;
    }
}
exports.Gengar = Gengar;
