import { INJECTOR } from "@angular/core";
import { Item } from "../model/player-data.model";

export const ITEMS: Record<string, Item> = {
    'INJECTOR': {
        name: 'Injector H-03',
        desc: 'Provides you with 6HP. You wonder what is in it.',
        effect: {
            type: "GAIN_HP",
            payload: 6
        }
    }
}