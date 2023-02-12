import { APP_CONSOLE_WARNING } from '@config';

export const my = {
    warn: (msg: string) => {
        if (APP_CONSOLE_WARNING)
            console.warn(msg);
    }
}