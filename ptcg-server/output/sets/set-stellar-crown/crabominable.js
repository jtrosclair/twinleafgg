"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crabominable = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Crabominable extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Crabrawler';
        this.cardType = W;
        this.hp = 160;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Food Prep',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Attacks used by this Pokémon cost [C] less for each Kofu card in your discard pile.'
            }];
        this.attacks = [{
                name: 'Haymaker',
                cost: [W, C, C, C, C],
                damage: 250,
                text: 'During your next turn, this Pokémon can\'t use Haymaker.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.name = 'Crabominable';
        this.fullName = 'Crabominable SCR';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Food Prep
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            if (effect.player !== player || player.active.getPokemonCard() !== this) {
                return state;
            }
            // i love checking for ability lock woooo
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            let kofuCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof game_1.TrainerCard && c.name === 'Kofu') {
                    kofuCount += 1;
                }
            });
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            effect.cost.splice(index, kofuCount);
            return state;
        }
        // Haymaker
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Haymaker')) {
                player.active.cannotUseAttacksNextTurnPending.push('Haymaker');
            }
        }
        return state;
    }
}
exports.Crabominable = Crabominable;
