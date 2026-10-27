
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // ============================================================
  // ARBORIA — DESIGN SYSTEM PREMIUM
  // Palette botanique vive • Mode clair / sombre
  // Angular standalone • Tailwind CSS • CSS Variables
  // API publique conservée • Compatibilité avec les composants
  // ============================================================

  private readonly darkMode = new BehaviorSubject<boolean>(false);

  readonly isDarkMode$ = this.darkMode.asObservable();
  readonly themeChange$ = this.darkMode.asObservable();

  // ============================================================
  // IDENTITÉ VISUELLE — ARBORIA
  // ============================================================

  readonly Forest = '#173F32';
  readonly Green = '#287653';
  readonly GreenHover = '#216447';
  readonly GreenActive = '#194F38';

  readonly Lime = '#D2F29A';
  readonly Teal = '#36BFA6';
  readonly Blue = '#739AF5';
  readonly Coral = '#F28B73';
  readonly Yellow = '#F2C96D';

  readonly White = '#FFFFFF';
  readonly Black = '#17231D';

  // Couleurs complémentaires plus vives.
  readonly Purple = '#9946D8';
  readonly Orange = '#F28C38';
  readonly Pink = '#D946A8';
  readonly Emerald = '#159B72';
  readonly Cyan = '#36C9E0';
  readonly Red = '#E65353';

  // ============================================================
  // TYPOGRAPHIE
  // ============================================================

  readonly FONT_DISPLAY = "'Cormorant Garamond', Georgia, serif";
  readonly FONT_BODY = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  readonly FONT_MONO = "'SFMono-Regular', Consolas, monospace";

  readonly FONT_SIZE_XS = '0.75rem';
  readonly FONT_SIZE_SM = '0.875rem';
  readonly FONT_SIZE_BASE = '1rem';
  readonly FONT_SIZE_LG = '1.125rem';
  readonly FONT_SIZE_XL = '1.25rem';
  readonly FONT_SIZE_2XL = '1.5rem';
  readonly FONT_SIZE_3XL = '1.875rem';
  readonly FONT_SIZE_4XL = '2.25rem';
  readonly FONT_SIZE_5XL = '3rem';
  readonly FONT_SIZE_6XL = '3.75rem';

  readonly LINE_HEIGHT_TIGHT = 1.15;
  readonly LINE_HEIGHT_HEADING = 1.25;
  readonly LINE_HEIGHT_BODY = 1.65;
  readonly LINE_HEIGHT_RELAXED = 1.8;

  readonly FONT_WEIGHT_REGULAR = 400;
  readonly FONT_WEIGHT_MEDIUM = 500;
  readonly FONT_WEIGHT_SEMIBOLD = 600;
  readonly FONT_WEIGHT_BOLD = 700;

  readonly LETTER_SPACING_TIGHT = '-0.04em';
  readonly LETTER_SPACING_NORMAL = '0';
  readonly LETTER_SPACING_WIDE = '0.06em';

  // ============================================================
  // ESPACEMENTS
  // ============================================================

  readonly SPACE_1 = '0.25rem';
  readonly SPACE_2 = '0.5rem';
  readonly SPACE_3 = '0.75rem';
  readonly SPACE_4 = '1rem';
  readonly SPACE_5 = '1.25rem';
  readonly SPACE_6 = '1.5rem';
  readonly SPACE_8 = '2rem';
  readonly SPACE_10 = '2.5rem';
  readonly SPACE_12 = '3rem';
  readonly SPACE_16 = '4rem';
  readonly SPACE_20 = '5rem';
  readonly SPACE_24 = '6rem';

  // ============================================================
  // RAYONS
  // ============================================================

  readonly RADIUS_SM = '0.5rem';
  readonly RADIUS_MD = '0.75rem';
  readonly RADIUS_LG = '1rem';
  readonly RADIUS_XL = '1.25rem';
  readonly RADIUS_2XL = '1.75rem';
  readonly RADIUS_3XL = '2rem';
  readonly RADIUS_FULL = '9999px';

  // ============================================================
  // ANIMATIONS
  // ============================================================

  readonly TRANSITION_FAST = '150ms ease';
  readonly TRANSITION_BASE = '220ms ease';
  readonly TRANSITION_SMOOTH = '300ms cubic-bezier(0.2, 0.65, 0.3, 1)';
  readonly TRANSITION_ENTER = '400ms cubic-bezier(0.16, 1, 0.3, 1)';

  // ============================================================
  // MISE EN PAGE
  // ============================================================

  readonly CONTENT_MAX_WIDTH = '1280px';
  readonly CONTENT_READING_WIDTH = '760px';
  readonly HEADER_HEIGHT = '76px';
  readonly MOBILE_HEADER_HEIGHT = '64px';

  // ============================================================
  // OMBRES
  // ============================================================

  readonly SHADOW_SM = '0 1px 2px rgba(23, 35, 29, 0.05)';
  readonly SHADOW_MD = '0 4px 16px rgba(23, 35, 29, 0.08)';
  readonly SHADOW_LG = '0 12px 32px rgba(23, 35, 29, 0.12)';
  readonly SHADOW_XL = '0 24px 60px rgba(23, 35, 29, 0.16)';

  // ============================================================
  // BLOC D'ANNONCE
  // ============================================================

  ANNOUNCEMENT = '';
  ANNOUNCEMENT_HOVER = '';
  ANNOUNCEMENT_TEXT = '';
  ANNOUNCEMENT_TEXT_MUTED = '';
  ANNOUNCEMENT_ACCENT = '';
  ANNOUNCEMENT_ICON_BG = '';
  ANNOUNCEMENT_BORDER = '';

  // ============================================================
  // PRIMARY
  // ============================================================

  Primary = '';
  PrimaryHover = '';
  PrimaryActive = '';
  PrimarySoft = '';
  PrimarySoftHover = '';
  BorderPrimary = '';

  // ============================================================
  // SECONDARY & ACCENT
  // ============================================================

  Secondary = '';
  SecondaryHover = '';
  SecondarySoft = '';

  Accent = '';
  AccentSoft = '';

  // ============================================================
  // BACKGROUNDS — 5 NIVEAUX
  // Clair : BG1 #FFFFFF → BG5 progressivement plus sombre.
  // Sombre : BG1 #202220 → BG5 progressivement plus clair.
  // ============================================================

  BG1 = '';
  BG2 = '';
  BG3 = '';
  BG4 = '';
  BG5 = '';

  // ============================================================
  // BORDURES — 5 NIVEAUX
  // ============================================================

  BR1 = '';
  BR2 = '';
  BR3 = '';
  BR4 = '';
  BR5 = '';

  // ============================================================
  // TEXTES — 6 NIVEAUX
  // ============================================================

  TX0 = '';
  TX1 = '';
  TX2 = '';
  TX3 = '';
  TX4 = '';
  TX5 = '';

  // ============================================================
  // COULEURS DE NAVIGATION
  // ============================================================

  BGV = '';
  BRV = '';
  TXV = '';

  BGO = '';
  BRO = '';
  TXO = '';

  BGG = '';
  BRG = '';
  TXG = '';

  BGR = '';
  BRR = '';
  TXR = '';

  // ============================================================
  // ÉLÉMENTS GÉNÉRAUX
  // ============================================================

  IB = '';
  ICON = '';
  SHADOW = '';

  // ============================================================
  // LABELS
  // ============================================================

  LABELBG = '';
  LABELBORDER = '';
  LABELICON = '';
  LABELTEXT = '';
  LABELPLACEHOLDER = '';

  // ============================================================
  // BADGE A — PRINCIPAL
  // ============================================================

  BADGEABG = '';
  BADGEABORDER = '';
  BADGEAICON = '';
  BADGEATEXT = '';

  // ============================================================
  // BADGE E — NEUTRE
  // ============================================================

  BADGEEBG = '';
  BADGEEBORDER = '';
  BADGEEICON = '';
  BADGEETEXT = '';

  // ============================================================
  // BADGE T — SECONDAIRE
  // ============================================================

  BADGETBG = '';
  BADGETBORDER = '';
  BADGETICON = '';
  BADGETTEXT = '';

  // ============================================================
  // RECHERCHE
  // ============================================================

  SEARCHBG = '';
  SEARCHBORDER = '';
  SEARCHICON = '';
  SEARCHTEXT = '';
  SEARCHPLACEHOLDER = '';
  SEARCHFOCUS = '';

  // ============================================================
  // BOUTON 1 — ACTION PRINCIPALE
  // ============================================================

  BUTON1BG = '';
  BUTON1HOVER = '';
  BUTON1ICON = '';
  BUTON1TEXT = '';
  BUTON1PLACEHOLDER = '';
  BUTON1SHADOW = '';

  // ============================================================
  // BOUTON 2 — ACTION SECONDAIRE
  // ============================================================

  BUTON2BG = '';
  BUTON2HOVER = '';
  BUTON2BORDER = '';
  BUTON2ICON = '';
  BUTON2TEXT = '';
  BUTON2HOVERBORDER = '';

  // ============================================================
  // SUCCESS
  // ============================================================

  Success = '';
  SuccessHover = '';
  SuccessSoft = '';
  SuccessBorder = '';

  // ============================================================
  // WARNING
  // ============================================================

  Warning = '';
  WarningHover = '';
  WarningSoft = '';
  WarningBorder = '';

  // ============================================================
  // ERROR
  // ============================================================

  Error = '';
  ErrorHover = '';
  ErrorSoft = '';
  ErrorBorder = '';

  // ============================================================
  // INFO
  // ============================================================

  Info = '';
  InfoHover = '';
  InfoSoft = '';
  InfoBorder = '';

  // ============================================================
  // IMAGES — CHEMINS PUBLICS CONSERVÉS
  // ============================================================

  ImageFondWelcome = '';
  ImageLogo = '';

  // ============================================================
  // CONSTRUCTEUR
  // ============================================================

  constructor() {
    const storedTheme = this.getStoredTheme();

    const prefersDark =
      typeof window !== 'undefined'
        ? window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
        : false;

    const isDark =
      storedTheme === 'dark'
        ? true
        : storedTheme === 'light'
          ? false
          : prefersDark;

    this.darkMode.next(isDark);
    this.applyTheme(isDark);
  }

  // ============================================================
  // STOCKAGE DU THÈME
  // ============================================================

  private getStoredTheme(): string | null {
    try {
      if (typeof localStorage === 'undefined') {
        return null;
      }

      const value = localStorage.getItem('theme');

      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  private storeTheme(theme: 'light' | 'dark'): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
    } catch {
      // Le thème reste fonctionnel sans stockage local.
    }
  }

  // ============================================================
  // COMMANDES DU THÈME
  // ============================================================

  toggleTheme(): void {
    this.setTheme(!this.darkMode.value);
  }

  setLightMode(): void {
    this.setTheme(false);
  }

  setDarkMode(): void {
    this.setTheme(true);
  }

  private setTheme(isDark: boolean): void {
    this.darkMode.next(isDark);
    this.storeTheme(isDark ? 'dark' : 'light');
    this.applyTheme(isDark);
  }

  resetTheme(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('theme');
      }
    } catch {
      // Le thème reste fonctionnel sans stockage local.
    }

    const systemPrefersDark =
      typeof window !== 'undefined'
        ? window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
        : false;

    this.darkMode.next(systemPrefersDark);
    this.applyTheme(systemPrefersDark);
  }

  // ============================================================
  // APPLICATION DU THÈME
  // ============================================================

  applyTheme(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;

      html.classList.toggle('dark', isDark);
      html.dataset['theme'] = isDark ? 'dark' : 'light';
      html.style.colorScheme = isDark ? 'dark' : 'light';
    }

    this.setThemeColors(isDark);
    this.applyDesignTokens();
  }

  // ============================================================
  // VARIABLES CSS — DESIGN TOKENS
  // ============================================================

  private applyDesignTokens(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;

    const tokens: Record<string, string | number> = {
      '--arboria-font-display': this.FONT_DISPLAY,
      '--arboria-font-body': this.FONT_BODY,
      '--arboria-font-mono': this.FONT_MONO,

      '--arboria-text-xs': this.FONT_SIZE_XS,
      '--arboria-text-sm': this.FONT_SIZE_SM,
      '--arboria-text-base': this.FONT_SIZE_BASE,
      '--arboria-text-lg': this.FONT_SIZE_LG,
      '--arboria-text-xl': this.FONT_SIZE_XL,
      '--arboria-text-2xl': this.FONT_SIZE_2XL,
      '--arboria-text-3xl': this.FONT_SIZE_3XL,
      '--arboria-text-4xl': this.FONT_SIZE_4XL,
      '--arboria-text-5xl': this.FONT_SIZE_5XL,
      '--arboria-text-6xl': this.FONT_SIZE_6XL,

      '--arboria-leading-tight': this.LINE_HEIGHT_TIGHT,
      '--arboria-leading-heading': this.LINE_HEIGHT_HEADING,
      '--arboria-leading-body': this.LINE_HEIGHT_BODY,
      '--arboria-leading-relaxed': this.LINE_HEIGHT_RELAXED,

      '--arboria-weight-regular': this.FONT_WEIGHT_REGULAR,
      '--arboria-weight-medium': this.FONT_WEIGHT_MEDIUM,
      '--arboria-weight-semibold': this.FONT_WEIGHT_SEMIBOLD,
      '--arboria-weight-bold': this.FONT_WEIGHT_BOLD,

      '--arboria-tracking-tight': this.LETTER_SPACING_TIGHT,
      '--arboria-tracking-normal': this.LETTER_SPACING_NORMAL,
      '--arboria-tracking-wide': this.LETTER_SPACING_WIDE,

      '--arboria-space-1': this.SPACE_1,
      '--arboria-space-2': this.SPACE_2,
      '--arboria-space-3': this.SPACE_3,
      '--arboria-space-4': this.SPACE_4,
      '--arboria-space-5': this.SPACE_5,
      '--arboria-space-6': this.SPACE_6,
      '--arboria-space-8': this.SPACE_8,
      '--arboria-space-10': this.SPACE_10,
      '--arboria-space-12': this.SPACE_12,
      '--arboria-space-16': this.SPACE_16,
      '--arboria-space-20': this.SPACE_20,
      '--arboria-space-24': this.SPACE_24,

      '--arboria-radius-sm': this.RADIUS_SM,
      '--arboria-radius-md': this.RADIUS_MD,
      '--arboria-radius-lg': this.RADIUS_LG,
      '--arboria-radius-xl': this.RADIUS_XL,
      '--arboria-radius-2xl': this.RADIUS_2XL,
      '--arboria-radius-3xl': this.RADIUS_3XL,
      '--arboria-radius-full': this.RADIUS_FULL,

      '--arboria-transition-fast': this.TRANSITION_FAST,
      '--arboria-transition-base': this.TRANSITION_BASE,
      '--arboria-transition-smooth': this.TRANSITION_SMOOTH,
      '--arboria-transition-enter': this.TRANSITION_ENTER,

      '--arboria-content-max': this.CONTENT_MAX_WIDTH,
      '--arboria-content-reading': this.CONTENT_READING_WIDTH,
      '--arboria-header-height': this.HEADER_HEIGHT,
      '--arboria-mobile-header-height': this.MOBILE_HEADER_HEIGHT,

      '--arboria-shadow-sm': this.SHADOW_SM,
      '--arboria-shadow-md': this.SHADOW_MD,
      '--arboria-shadow-lg': this.SHADOW_LG,
      '--arboria-shadow-xl': this.SHADOW_XL
    };

    Object.entries(tokens).forEach(([property, value]) => {
      root.style.setProperty(property, String(value));
    });

    const colorTokens: Record<string, string> = {
      '--arboria-forest': this.Forest,
      '--arboria-green': this.Green,
      '--arboria-green-hover': this.GreenHover,
      '--arboria-green-active': this.GreenActive,
      '--arboria-lime': this.Lime,
      '--arboria-teal': this.Teal,
      '--arboria-blue': this.Blue,
      '--arboria-coral': this.Coral,
      '--arboria-yellow': this.Yellow,
      '--arboria-purple': this.Purple,
      '--arboria-orange': this.Orange,
      '--arboria-pink': this.Pink,
      '--arboria-emerald': this.Emerald,
      '--arboria-cyan': this.Cyan,
      '--arboria-red': this.Red,

      '--BG1': this.BG1,
      '--BG2': this.BG2,
      '--BG3': this.BG3,
      '--BG4': this.BG4,
      '--BG5': this.BG5,

      '--BR1': this.BR1,
      '--BR2': this.BR2,
      '--BR3': this.BR3,
      '--BR4': this.BR4,
      '--BR5': this.BR5,

      '--TX0': this.TX0,
      '--TX1': this.TX1,
      '--TX2': this.TX2,
      '--TX3': this.TX3,
      '--TX4': this.TX4,
      '--TX5': this.TX5,

      '--Primary': this.Primary,
      '--PrimaryHover': this.PrimaryHover,
      '--PrimaryActive': this.PrimaryActive,
      '--PrimarySoft': this.PrimarySoft,
      '--PrimarySoftHover': this.PrimarySoftHover,
      '--BorderPrimary': this.BorderPrimary,

      '--Secondary': this.Secondary,
      '--SecondaryHover': this.SecondaryHover,
      '--SecondarySoft': this.SecondarySoft,
      '--Accent': this.Accent,
      '--AccentSoft': this.AccentSoft,

      '--BGV': this.BGV,
      '--BRV': this.BRV,
      '--TXV': this.TXV,
      '--BGO': this.BGO,
      '--BRO': this.BRO,
      '--TXO': this.TXO,
      '--BGG': this.BGG,
      '--BRG': this.BRG,
      '--TXG': this.TXG,
      '--BGR': this.BGR,
      '--BRR': this.BRR,
      '--TXR': this.TXR,

      '--IB': this.IB,
      '--ICON': this.ICON,
      '--SHADOW': this.SHADOW,

      '--ANNOUNCEMENT': this.ANNOUNCEMENT,
      '--ANNOUNCEMENT-HOVER': this.ANNOUNCEMENT_HOVER,
      '--ANNOUNCEMENT-TEXT': this.ANNOUNCEMENT_TEXT,
      '--ANNOUNCEMENT-TEXT-MUTED': this.ANNOUNCEMENT_TEXT_MUTED,
      '--ANNOUNCEMENT-ACCENT': this.ANNOUNCEMENT_ACCENT,
      '--ANNOUNCEMENT-ICON-BG': this.ANNOUNCEMENT_ICON_BG,
      '--ANNOUNCEMENT-BORDER': this.ANNOUNCEMENT_BORDER,

      '--LABELBG': this.LABELBG,
      '--LABELBORDER': this.LABELBORDER,
      '--LABELICON': this.LABELICON,
      '--LABELTEXT': this.LABELTEXT,
      '--LABELPLACEHOLDER': this.LABELPLACEHOLDER,

      '--BADGEABG': this.BADGEABG,
      '--BADGEABORDER': this.BADGEABORDER,
      '--BADGEAICON': this.BADGEAICON,
      '--BADGEATEXT': this.BADGEATEXT,

      '--BADGEEBG': this.BADGEEBG,
      '--BADGEEBORDER': this.BADGEEBORDER,
      '--BADGEEICON': this.BADGEEICON,
      '--BADGEETEXT': this.BADGEETEXT,

      '--BADGETBG': this.BADGETBG,
      '--BADGETBORDER': this.BADGETBORDER,
      '--BADGETICON': this.BADGETICON,
      '--BADGETTEXT': this.BADGETTEXT,

      '--SEARCHBG': this.SEARCHBG,
      '--SEARCHBORDER': this.SEARCHBORDER,
      '--SEARCHICON': this.SEARCHICON,
      '--SEARCHTEXT': this.SEARCHTEXT,
      '--SEARCHPLACEHOLDER': this.SEARCHPLACEHOLDER,
      '--SEARCHFOCUS': this.SEARCHFOCUS,

      '--BUTON1BG': this.BUTON1BG,
      '--BUTON1HOVER': this.BUTON1HOVER,
      '--BUTON1ICON': this.BUTON1ICON,
      '--BUTON1TEXT': this.BUTON1TEXT,
      '--BUTON1PLACEHOLDER': this.BUTON1PLACEHOLDER,
      '--BUTON1SHADOW': this.BUTON1SHADOW,

      '--BUTON2BG': this.BUTON2BG,
      '--BUTON2HOVER': this.BUTON2HOVER,
      '--BUTON2BORDER': this.BUTON2BORDER,
      '--BUTON2ICON': this.BUTON2ICON,
      '--BUTON2TEXT': this.BUTON2TEXT,
      '--BUTON2HOVERBORDER': this.BUTON2HOVERBORDER,

      '--Success': this.Success,
      '--SuccessHover': this.SuccessHover,
      '--SuccessSoft': this.SuccessSoft,
      '--SuccessBorder': this.SuccessBorder,

      '--Warning': this.Warning,
      '--WarningHover': this.WarningHover,
      '--WarningSoft': this.WarningSoft,
      '--WarningBorder': this.WarningBorder,

      '--Error': this.Error,
      '--ErrorHover': this.ErrorHover,
      '--ErrorSoft': this.ErrorSoft,
      '--ErrorBorder': this.ErrorBorder,

      '--Info': this.Info,
      '--InfoHover': this.InfoHover,
      '--InfoSoft': this.InfoSoft,
      '--InfoBorder': this.InfoBorder
    };

    Object.entries(colorTokens).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    root.style.setProperty('--arboria-bg', this.BG1);
    root.style.setProperty('--arboria-surface', this.BG3);
    root.style.setProperty('--arboria-surface-secondary', this.BG2);
    root.style.setProperty('--arboria-text', this.TX0);
    root.style.setProperty('--arboria-text-muted', this.TX2);
    root.style.setProperty('--arboria-border', this.BR1);
    root.style.setProperty('--arboria-primary', this.Primary);
  }

  // ============================================================
  // PALETTES — CLAIR / SOMBRE
  // ============================================================

  setThemeColors(isDark: boolean): void {
    if (isDark) {
      // ==========================================================
      // MODE SOMBRE
      // BG1 part de #202220.
      // Chaque niveau est plus clair que le précédent.
      // ==========================================================

      this.BG1 = '#202220';
      this.BG2 = '#242623';
      this.BG3 = '#272A26';
      this.BG4 = '#2B2F2A';
      this.BG5 = '#2E312D';

      this.BR1 = '#292C29';
      this.BR2 = '#303430';
      this.BR3 = '#393E39';
      this.BR4 = '#454B45';
      this.BR5 = '#525952';

      this.TX0 = '#FFFFFF';
      this.TX1 = '#E8EBE6';
      this.TX2 = '#D1D6CE';
      this.TX3 = '#B8C0B5';
      this.TX4 = '#9EA89A';
      this.TX5 = '#202220';


      // ----------------------------------------------------------
      // NAVIGATION MULTICOLORE
      // ----------------------------------------------------------

      this.BGV = '#9946D8';
      this.BRV = '#C18BEA';
      this.TXV = '#FFFFFF';

      this.BGO = '#F28C38';
      this.BRO = '#FFC078';
      this.TXO = '#202220';

      this.BGG = '#159B72';
      this.BRG = '#78D8B5';
      this.TXG = '#FFFFFF';

      this.BGR = '#D946A8';
      this.BRR = '#F09DD6';
      this.TXR = '#FFFFFF';

      // ----------------------------------------------------------
      // PRIMARY
      // ----------------------------------------------------------

      this.Primary = '#D2F29A';
      this.PrimaryHover = '#E1FFB0';
      this.PrimaryActive = '#B8E778';
      this.PrimarySoft = '#343F30';
      this.PrimarySoftHover = '#414D3A';
      this.BorderPrimary = '#91B968';

      // ----------------------------------------------------------
      // SECONDARY & ACCENT
      // ----------------------------------------------------------

      this.Secondary = '#C3CEC1';
      this.SecondaryHover = '#E3EAE1';
      this.SecondarySoft = '#303730';

      this.Accent = '#36D6B5';
      this.AccentSoft = '#253E36';

      // ----------------------------------------------------------
      // GÉNÉRAL
      // ----------------------------------------------------------

      this.IB = '#303430';
      this.ICON = '#D2E2D0';
      this.SHADOW = 'rgba(0, 0, 0, 0.30)';

      // ----------------------------------------------------------
      // LABELS
      // ----------------------------------------------------------

      this.LABELBG = '#303430';
      this.LABELBORDER = '#4A514A';
      this.LABELICON = '#8DE6D0';
      this.LABELTEXT = '#F5F8F3';
      this.LABELPLACEHOLDER = '#A4B2A2';

      // ----------------------------------------------------------
      // BADGE A — PRINCIPAL
      // ----------------------------------------------------------

      this.BADGEABG = '#354630';
      this.BADGEABORDER = '#607C4C';
      this.BADGEAICON = '#D2F29A';
      this.BADGEATEXT = '#F1FBDD';

      // ----------------------------------------------------------
      // BADGE E — NEUTRE
      // ----------------------------------------------------------

      this.BADGEEBG = '#343834';
      this.BADGEEBORDER = '#4A514A';
      this.BADGEEICON = '#C3CEC1';
      this.BADGEETEXT = '#E3EAE1';

      // ----------------------------------------------------------
      // BADGE T — SECONDAIRE
      // ----------------------------------------------------------

      this.BADGETBG = '#293E3A';
      this.BADGETBORDER = '#3E7065';
      this.BADGETICON = '#54E0C2';
      this.BADGETTEXT = '#D7FFF5';

      // ----------------------------------------------------------
      // SEARCH
      // ----------------------------------------------------------

      this.SEARCHBG = '#303430';
      this.SEARCHBORDER = '#505950';
      this.SEARCHICON = '#9EE8D6';
      this.SEARCHTEXT = '#F5F8F3';
      this.SEARCHPLACEHOLDER = '#A4B2A2';
      this.SEARCHFOCUS = 'rgba(54, 214, 181, 0.15)';

      // ----------------------------------------------------------
      // BUTTON 1
      // ----------------------------------------------------------

      this.BUTON1BG = '#D2F29A';
      this.BUTON1HOVER = '#E1FFB0';
      this.BUTON1ICON = '#202820';
      this.BUTON1TEXT = '#202820';
      this.BUTON1PLACEHOLDER = '#61764E';
      this.BUTON1SHADOW = 'rgba(0, 0, 0, 0.25)';

      // ----------------------------------------------------------
      // BUTTON 2
      // ----------------------------------------------------------

      this.BUTON2BG = '#343834';
      this.BUTON2HOVER = '#454B45';
      this.BUTON2BORDER = '#505950';
      this.BUTON2ICON = '#E3EAE1';
      this.BUTON2TEXT = '#F5F8F3';
      this.BUTON2HOVERBORDER = '#7C897B';

      // ----------------------------------------------------------
      // SUCCESS
      // ----------------------------------------------------------

      this.Success = '#70E39A';
      this.SuccessHover = '#98F1B6';
      this.SuccessSoft = '#263D2E';
      this.SuccessBorder = '#43865A';

      // ----------------------------------------------------------
      // WARNING
      // ----------------------------------------------------------

      this.Warning = '#FFD166';
      this.WarningHover = '#FFE29A';
      this.WarningSoft = '#443923';
      this.WarningBorder = '#947541';

      // ----------------------------------------------------------
      // ERROR
      // ----------------------------------------------------------

      this.Error = '#FF827A';
      this.ErrorHover = '#FFA49D';
      this.ErrorSoft = '#462B2B';
      this.ErrorBorder = '#9A5350';

      // ----------------------------------------------------------
      // INFO
      // ----------------------------------------------------------

      this.Info = '#86B6FF';
      this.InfoHover = '#B1D0FF';
      this.InfoSoft = '#29374B';
      this.InfoBorder = '#5279AE';

      // ----------------------------------------------------------
      // IMAGES
      // ----------------------------------------------------------

      this.ImageFondWelcome = 'assets/ImageFondWelcomeNuit.png';
      this.ImageLogo = 'assets/ImageLogoSombre.svg';

      // ----------------------------------------------------------
      // BLOC D'ANNONCE
      // ----------------------------------------------------------

      this.ANNOUNCEMENT = '#303430';
      this.ANNOUNCEMENT_HOVER = '#393E39';
      this.ANNOUNCEMENT_TEXT = '#F5F8F3';
      this.ANNOUNCEMENT_TEXT_MUTED = '#C3CEC1';
      this.ANNOUNCEMENT_ACCENT = '#D2F29A';
      this.ANNOUNCEMENT_ICON_BG = '#414D3A';
      this.ANNOUNCEMENT_BORDER = '#505950';

      return;
    }

    // ==========================================================
// MODE CLAIR
// BG1 part de #FFFFFF.
// Chaque niveau devient progressivement plus sombre.
// ==========================================================

this.BG1 = '#FFFFFF';
this.BG2 = '#F5F7F3';
this.BG3 = '#EBEFE9';
this.BG4 = '#DEE5DA';
this.BG5 = '#CED9C9';

this.BR1 = '#E1E8DE';
this.BR2 = '#CDD9C9';
this.BR3 = '#B3C5AE';
this.BR4 = '#92AA8C';
this.BR5 = '#718B6D';

this.TX0 = '#1D3025';
this.TX1 = '#304A38';
this.TX2 = '#4D6853';
this.TX3 = '#6B846E';
this.TX4 = '#829681';
this.TX5 = '#FFFFFF';
    // ----------------------------------------------------------
    // NAVIGATION MULTICOLORE
    // ----------------------------------------------------------

    this.BGV = '#9946D8';
    this.BRV = '#C18BEA';
    this.TXV = '#FFFFFF';

    this.BGO = '#F28C38';
    this.BRO = '#FFC078';
    this.TXO = '#FFFFFF';

    this.BGG = '#159B72';
    this.BRG = '#78D8B5';
    this.TXG = '#FFFFFF';

    this.BGR = '#D946A8';
    this.BRR = '#F09DD6';
    this.TXR = '#FFFFFF';

    // ----------------------------------------------------------
    // PRIMARY
    // ----------------------------------------------------------

    this.Primary = '#216447';
    this.PrimaryHover = '#194F38';
    this.PrimaryActive = '#143F2D';
    this.PrimarySoft = '#E1F2E6';
    this.PrimarySoftHover = '#D0EBDD';
    this.BorderPrimary = '#9FC8AA';

    // ----------------------------------------------------------
    // SECONDARY & ACCENT
    // ----------------------------------------------------------

    this.Secondary = '#4D6853';
    this.SecondaryHover = '#304A38';
    this.SecondarySoft = '#E8EEE5';

    this.Accent = '#159B72';
    this.AccentSoft = '#DDF7ED';

    // ----------------------------------------------------------
    // GÉNÉRAL
    // ----------------------------------------------------------

    this.IB = '#FFFFFF';
    this.ICON = '#287653';
    this.SHADOW = 'rgba(29, 48, 37, 0.09)';

    // ----------------------------------------------------------
    // LABELS
    // ----------------------------------------------------------

    this.LABELBG = '#FFFFFF';
    this.LABELBORDER = '#D6E2D2';
    this.LABELICON = '#159B72';
    this.LABELTEXT = '#1D3025';
    this.LABELPLACEHOLDER = '#829681';

    // ----------------------------------------------------------
    // BADGE A — PRINCIPAL
    // ----------------------------------------------------------

    this.BADGEABG = '#DDF5E2';
    this.BADGEABORDER = '#B7E1C1';
    this.BADGEAICON = '#159B72';
    this.BADGEATEXT = '#185438';

    // ----------------------------------------------------------
    // BADGE E — NEUTRE
    // ----------------------------------------------------------

    this.BADGEEBG = '#EBEFE9';
    this.BADGEEBORDER = '#D3DDD0';
    this.BADGEEICON = '#6B846E';
    this.BADGEETEXT = '#405745';

    // ----------------------------------------------------------
    // BADGE T — SECONDAIRE
    // ----------------------------------------------------------

    this.BADGETBG = '#DDF5F1';
    this.BADGETBORDER = '#B8E8DE';
    this.BADGETICON = '#078D9D';
    this.BADGETTEXT = '#17626B';

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------

    this.SEARCHBG = '#FFFFFF';
    this.SEARCHBORDER = '#C9D8C5';
    this.SEARCHICON = '#287653';
    this.SEARCHTEXT = '#1D3025';
    this.SEARCHPLACEHOLDER = '#829681';
    this.SEARCHFOCUS = 'rgba(21, 155, 114, 0.12)';

    // ----------------------------------------------------------
    // BUTTON 1
    // ----------------------------------------------------------

    this.BUTON1BG = '#216447';
    this.BUTON1HOVER = '#194F38';
    this.BUTON1ICON = '#FFFFFF';
    this.BUTON1TEXT = '#FFFFFF';
    this.BUTON1PLACEHOLDER = '#D6E2D2';
    this.BUTON1SHADOW = 'rgba(33, 100, 71, 0.20)';

    // ----------------------------------------------------------
    // BUTTON 2
    // ----------------------------------------------------------

    this.BUTON2BG = '#FFFFFF';
    this.BUTON2HOVER = '#F0F5ED';
    this.BUTON2BORDER = '#CDDCC8';
    this.BUTON2ICON = '#304A38';
    this.BUTON2TEXT = '#304A38';
    this.BUTON2HOVERBORDER = '#9FB99B';

    // ----------------------------------------------------------
    // SUCCESS
    // ----------------------------------------------------------

    this.Success = '#087D4D';
    this.SuccessHover = '#06643D';
    this.SuccessSoft = '#DDF5E5';
    this.SuccessBorder = '#A8DDB9';

    // ----------------------------------------------------------
    // WARNING
    // ----------------------------------------------------------

    this.Warning = '#946000';
    this.WarningHover = '#744A00';
    this.WarningSoft = '#FFF2CE';
    this.WarningBorder = '#F0D38A';

    // ----------------------------------------------------------
    // ERROR
    // ----------------------------------------------------------

    this.Error = '#C73545';
    this.ErrorHover = '#A52635';
    this.ErrorSoft = '#FFE8EA';
    this.ErrorBorder = '#F4BBC1';

    // ----------------------------------------------------------
    // INFO
    // ----------------------------------------------------------

    this.Info = '#285CC4';
    this.InfoHover = '#1F489C';
    this.InfoSoft = '#E6EEFF';
    this.InfoBorder = '#B8CCFA';

    // ----------------------------------------------------------
    // IMAGES — CHEMINS CONSERVÉS
    // ----------------------------------------------------------

    this.ImageFondWelcome = 'assets/ImageFondWelcomeClair.png';
    this.ImageLogo = 'assets/ImageLogoClair.svg';

    // ----------------------------------------------------------
    // BLOC D'ANNONCE
    // ----------------------------------------------------------

    this.ANNOUNCEMENT = '#173F32';
    this.ANNOUNCEMENT_HOVER = '#245541';
    this.ANNOUNCEMENT_TEXT = '#F6FAF5';
    this.ANNOUNCEMENT_TEXT_MUTED = '#D5E5D9';
    this.ANNOUNCEMENT_ACCENT = '#D2F29A';
    this.ANNOUNCEMENT_ICON_BG = '#2B5944';
    this.ANNOUNCEMENT_BORDER = '#426C54';
  }

  // ============================================================
  // GETTER — COMPATIBILITÉ AVEC LES COMPOSANTS EXISTANTS
  // ============================================================

  get isDarkMode(): boolean {
    return this.darkMode.value;
  }
}
