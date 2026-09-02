import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const NoirAuraThemePreset = definePreset(Aura, {
  semantic: {
    primary: palette('{zinc}'),
    surface: palette('{slate}'),
  },
});
