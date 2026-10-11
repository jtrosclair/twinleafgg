import { MoveDamagePrompt, DamageTransfer } from '../../game/store/prompts/move-damage-prompt';
import { State } from '../../game/store/state/state';
export declare class MoonInviteDamagePrompt extends MoveDamagePrompt {
    validate(result: DamageTransfer[] | null, state: State): boolean;
}
