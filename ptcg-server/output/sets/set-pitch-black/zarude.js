"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zarude = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const shadow_darkness_energy_1 = require("./shadow-darkness-energy");
class Zarude extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Overhead Throw',
                cost: [D],
                damage: 30,
                text: 'This attack also does 30 damage to 1 of your Benched Pokémon.',
            },
            {
                name: 'Shadow Whip',
                cost: [D, D, D],
                damage: 100,
                damageCalculation: '+',
                text: 'If any of your Benched Pokémon has any Shadow Darkness Energy attached to them, this attack does 70 more damage.',
            }];
        this.set = 'M5';
        this.setNumber = '54';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zarude';
        this.fullName = 'Zarude M5';
    }
    benchHasShadowDarknessEnergy(player) {
        return player.bench.some(bench => bench.cards.length > 0
            && bench.cards.some(c => c instanceof shadow_darkness_energy_1.ShadowDarknessEnergy));
    }
    reduceEffect(store, state, effect) {
        // Overhead Throw
        // Ref: set-crown-zenith/dubwool.ts (Overhead Throw)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const benched = player.bench.filter(b => b.cards.length > 0);
            if (benched.length > 0) {
                store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                    if (!targets || targets.length === 0) {
                        return;
                    }
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = targets[0];
                    store.reduceEffect(state, damageEffect);
                });
            }
        }
        // Shadow Whip
        // Ref: set-pitch-black/mega-darkrai-ex.ts (Night Raid - bench scan)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (this.benchHasShadowDarknessEnergy(player)) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.Zarude = Zarude;
