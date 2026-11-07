import { animate, state, style, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';

/** Animations used by PtcgPrompt. */
export const ptcgPromptAnimations: {
  readonly promptContent: AnimationTriggerMetadata;
  readonly selectorFade: AnimationTriggerMetadata;
  readonly selectorVisibility: AnimationTriggerMetadata;
} = {
  /** Animation that is applied on the dialog container by default. */
  promptContent: trigger('state', [
    // Initial hidden state
    state('void, exit', style({
      opacity: 0,
      transform: 'scale(0.7)',
      transformOrigin: 'center center'
    })),

    // Fully visible state
    state('enter', style({
      transform: 'translate3d(0, 0, 0)'
    })),

    // Enter animation
    transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)',
      style({
        transform: 'translate3d(0, 0, 0)',
        opacity: 1
      })
    )),

    // Exit animation (slightly longer for better UX)
    transition('* => void, * => exit', animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      style({ opacity: 0 })
    )),
  ]),
  selectorFade: trigger('selectorFade', [
    transition(':enter', [style({ opacity: 0 }), animate('{{duration}}ms ease-out', style({ opacity: 1 }))],
      { params: { duration: 100 } }),
    transition(':leave', animate('{{duration}}ms ease-in', style({ opacity: 0 })),
      { params: { duration: 100 } })
  ]),
  selectorVisibility: trigger('selectorVisibility', [
    state('shown', style({ opacity: 1 })),
    state('hidden', style({ opacity: 0 })),
    transition('shown => hidden', animate('{{duration}}ms ease-in'), { params: { duration: 100 } }),
    transition('hidden => shown', animate('{{duration}}ms ease-out'), { params: { duration: 100 } })
  ])
};
