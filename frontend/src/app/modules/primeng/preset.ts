import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const PrimeNGPreset = definePreset(Aura, {
    darkModeSelector: false,
    semantic: {
        secondary: {
            50: '{lime.50}',
            100: '{lime.100}',
            200: '{lime.200}',
            300: '{lime.300}',
            400: '{lime.400}',
            500: '{lime.500}',
            600: '{lime.600}',
            700: '{lime.700}',
            800: '{lime.800}',
            900: '{lime.900}',
            950: '{lime.950}'
        },
        dark: { 
            surface: {
                0: '#ffffff',
                50: '{slate.50}',
                100: '{slate.100}',
                200: '{slate.200}',
                300: '{slate.300}',
                400: '{slate.400}',
                500: '{slate.500}',
                600: '{slate.600}',
                700: '{slate.700}',
                800: '{slate.800}',
                900: '{slate.900}',
                950: '{slate.950}'
            },
        },
        light: {
            surface: {
                0: '#ffffff',
                50:  '{slate.50}',
                100: '{slate.100}',
                200: '{slate.200}',
                300: '{slate.300}',
                400: '{slate.400}',
                500: '{slate.500}',
                600: '{slate.600}',
                700: '{slate.700}',
                800: '{slate.800}',
                900: '{slate.900}',
                950: '{slate.950}'
            },
        },
        colorScheme: {
            dark: {
                pageBackground: '{surface.900}',
                surface: {
                    background: '{surface.900}'
                },
                primary: {
                    color: '{secondary.400}',
                    inverseColor: '{secondary.400}',
                    hoverColor: '{secondary.300}',
                    activeColor: '{secondary.200}'
                },
                highlight: {
                    background: '{surface.900}',
                    focusBackground: '{surface.900}',
                    color: '{slate.50}',
                    focusColor: '{slate.50}'
                },
                formField: {
                    hoverBorderColor: '{secondary.300}',
                    background: '{surface.900}'
                },
                focusRing: {
                    width: '2px',
                    color: '{secondary.300}',
                    offset: '1px'
                },
                text: {
                    color: '{slate.50}'
                }
            },
            light: {
                pageBackground: '{surface.50}',
                surface:{
                    background: '{surface.50}'
                },
                primary: {
                    color: '{secondary.400}',
                    inverseColor: '{secondary.400}',
                    hoverColor: '{secondary.300}',
                    activeColor: '{secondary.200}'
                },
                formField: {
                    hoverBorderColor: '{secondary.300}',
                    background: '{surface.50}'
                },
                focusRing: {
                    width: '2px',
                    color: '{secondary.300}',
                    offset: '1px'
                },
            }
        }
    }
})