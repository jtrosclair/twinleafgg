"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolcanionEX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class VolcanionEX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = R;
        this.additionalCardTypes = [W];
        this.tags = [game_1.CardTag.POKEMON_EX];
        this.stage = game_1.Stage.BASIC;
        this.hp = 180;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Steam Up',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may discard a [R] Energy card from your hand. If you do, during this turn, your Basic [R] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Volcanic Heat',
                cost: [R, R, C],
                damage: 130,
                text: 'This Pokémon can\'t attack during your next turn.'
            }];
        this.set = 'STS';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Volcanion-EX';
        this.fullName = 'Volcanion EX STS';
        this.STEAM_UP_MARKER = 'STEAM_UP_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Volcanic Heat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.hand.cards.filter(c => c.superType === game_1.SuperType.ENERGY && c.energyType === game_1.EnergyType.BASIC && c.name === 'Fire Energy').length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, max: 1, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    const energy = selected[0];
                    player.hand.moveCardTo(energy, player.discard);
                    player.marker.addMarker(this.STEAM_UP_MARKER, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.player.marker.hasMarker(this.STEAM_UP_MARKER)) {
            const source = effect.source.getPokemonCard();
            if (source && source.stage === game_1.Stage.BASIC && source.cardType === game_1.CardType.FIRE) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.VolcanionEX = VolcanionEX;
