"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swampertex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useEnergyRecycle(next, store, state, effect) {
    const player = effect.player;
    (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, effect.card);
    yield store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 3 }), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
            next();
        }
    });
    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
    store.reduceEffect(state, endTurnEffect);
    return state;
}
class Swampertex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Marshtomp';
        this.cardType = W;
        this.hp = 150;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Energy Recycle',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may search your discard pile for 3 Energy cards and attach them to your Pokémon in any way you like. If you do, your turn ends. This power can\'t be used if Swampert ex is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Ultra Pump',
                cost: [W, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'You may discard 2 cards from your hand. If you do, this attack does 60 damage plus 20 more damage and does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'CG';
        this.name = 'Swampert ex';
        this.fullName = 'Swampert ex CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.hand.cards.length < 2) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 2, max: 2 }), cards => {
                        cards = cards || [];
                        if (cards.length === 0) {
                            return;
                        }
                        (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards, sourceEffect: this.attacks[0] });
                        effect.damage += 20;
                        (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
                    });
                }
            }, game_1.GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
            return state;
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const generator = useEnergyRecycle(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Swampertex = Swampertex;
