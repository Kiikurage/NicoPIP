export const MessageType = {
    ACTIVATE_BROWSER_ACTION: 'ACTIVATE_BROWSER_ACTION',
    TOGGLE_PIP: 'TOGGLE_PIP',
} as const;

export interface AbstractMessage<T extends keyof typeof MessageType> {
    type: T;
}

export type ActivateBrowserActionMessage = AbstractMessage<'ACTIVATE_BROWSER_ACTION'>;

export type TogglePIPMessage = AbstractMessage<'TOGGLE_PIP'>;

export type Message = ActivateBrowserActionMessage | TogglePIPMessage;
