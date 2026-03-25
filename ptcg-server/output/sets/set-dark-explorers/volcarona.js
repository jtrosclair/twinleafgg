"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volcarona = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Volcarona extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Larvesta';
        this.cardType = R;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Scorching Scales',
                powerType: game_1.PowerType.ABILITY,
                text: 'Put 4 damage counters instead of 2 on your opponent\'s Burned Pokémon between turns.'
            }];
        this.attacks = [
            {
                name: 'Burning Wind',
                cost: [R, C, C],
                damage: 70,
                text: 'You may discard an Energy attached to this Pokémon. If you do, the Defending Pokémon is now Burned.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Volcarona';
        this.fullName = 'Volcarona DEX';
    }
    reduceEffect(store, state, effect) {
        // Scorching Scales - increase burn damage
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Find which player owns this Volcarona
            let volcaronaOwner = null;
            [player, opponent].forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card === this) {
                        volcaronaOwner = p;
                    }
                });
            });
            if (!volcaronaOwner) {
                return state;
            }
            // Check if ability is blocked
            try {
                const stub = new game_effects_1.PowerEffect(volcaronaOwner, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Apply extra burn damage to opponent's active if burned
            const volcaronaOpponent = game_1.StateUtils.getOpponent(state, volcaronaOwner);
            if (effect.player === volcaronaOpponent && volcaronaOpponent.active.specialConditions.includes(card_types_1.SpecialCondition.BURNED)) {
                // Default burn is 20 (2 damage counters), we want 40 (4 damage counters)
                // So add 20 more damage
                effect.burnDamage += 20;
            }
        }
        // Burning Wind
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToDiscard => {
                if (!wantToDiscard) {
                    return;
                }
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                store.reduceEffect(state, checkProvidedEnergy);
                store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                    const cards = (energy || []).map(e => e.card);
                    if (cards.length === 0) {
                        return;
                    }
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEnergy.target = player.active;
                    store.reduceEffect(state, discardEnergy);
                    (0, attack_effects_2.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
                });
            });
        }
        return state;
    }
}
exports.Volcarona = Volcarona;
