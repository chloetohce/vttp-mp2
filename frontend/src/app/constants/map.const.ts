import { MapLocation } from "../model/player-data.model";

export const MAP_LOCATIONS: MapLocation[] = [
    {
        name: 'Akisen Ramen',
        x: 0.11,
        y: 0.50,
        npc: 'miyamoto',
        desc: 'Cheap, but food is food.',
        key: 'akisen-ramen'
    }, {
        name: 'The Last Bean',
        x: 0.76, 
        y: 0.24,
        npc: 'quinn',
        desc: 'A cozy little hole in the wall; if you can ignore the owners penchant for smoking.',
        key: 'last-bean'
    }, {
        name: 'Lotus Garden',
        x: 0.46,
        y: 0.89 ,
        npc: 'everton',
        desc: 'An old, rundown mindfulness centre repurposed into a clinic. You wonder why you even trust that guy.',
        key: 'lotus-garden'
    },
    {
        name: 'Bitcradle',
        x: 0.26,
        y: 0.32,
        npc: 'jax',
        desc: 'For all your bot needs.',
        key: 'bitcradle'
    }
]