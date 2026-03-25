"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zygarde = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zygarde extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Cellular Companions',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is on your Bench, your Zygarde\'s and Zygarde-GX\'s attacks do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Boost Fang',
                cost: [F],
                damage: 20,
                text: 'Attach a [F] Energy card from your discard pile to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '124';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zygarde';
        this.fullName = 'Zygarde UNM';
    }
    reduceEffect(store, state, effect) {
        // Ability: Cellular Companions (passive - boost damage for Zygarde/Zygarde-GX)
        // Ref: set-team-up/tentacruel.ts (Paranormal - passive DealDamageEffect intercept)
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.damage > 0) {
            const sourceCard = effect.source.getPokemonCard();
            if (!sourceCard) {
                return state;
            }
            // Check if the attacking Pokemon is a Zygarde or Zygarde-GX
            if (sourceCard.name !== 'Zygarde' && sourceCard.name !== 'Zygarde-GX') {
                return state;
            }
            // Check if the target is the opponent's active
            const sourcePlayer = game_1.StateUtils.findOwner(state, effect.source);
            const opponent = game_1.StateUtils.getOpponent(state, sourcePlayer);
            if (effect.target !== opponent.active) {
                return state;
            }
            // Check if this Zygarde is on the bench of the attacker's side
            let isOnBench = false;
            sourcePlayer.bench.forEach(b => {
                if (b.getPokemonCard() === this && b.cards.includes(this)) {
                    isOnBench = true;
                }
            });
            if (!isOnBench) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, sourcePlayer, this)) {
                return state;
            }
            effect.damage += 20;
        }
        // Attack 1: Boost Fang
        // Ref: set-unbroken-bonds/kyurem.ts (Call Forth Cold - attach energy from discard)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { allowCancel: true, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Zygarde = Zygarde;
