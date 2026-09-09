import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // ============================================================
  // 🌿 JARDISCAN — PREMIUM NATURE DESIGN SYSTEM
  //
  // • Light / Dark
  // • Primary
  // • Secondary
  // • Accent
  // • Backgrounds
  // • Surfaces / Cards
  // • Borders
  // • Textes
  // • États
  // • Overlays
  // • Ombres
  // • Image Welcome
  // • Compatible Tailwind / Angular
  // ============================================================


  // ============================================================
  // 🌗 DARK MODE STATE
  // ============================================================

  private darkMode = new BehaviorSubject<boolean>(false);

  isDarkMode$ = this.darkMode.asObservable();

  themeChange$ = this.darkMode.asObservable();


  // ============================================================
  // 🌿 PRIMARY
  // ============================================================

  Primary = '';
  PrimaryHover = '';
  PrimaryActive = '';
  PrimarySoft = '';
  PrimarySoftHover = '';

  BorderPrimary = '';


  // ============================================================
  // 🎨 SECONDARY
  // ============================================================

  Secondary = '';
  SecondaryHover = '';
  SecondarySoft = '';

  Accent = '';
  AccentSoft = '';


  // ============================================================
  // 🖥️ BACKGROUNDS
  // ============================================================

  Background1 = '';
  Background2 = '';
  Background3 = '';
  Background4 = '';

  BackgroundHero = '';
  BackgroundSection = '';
  BackgroundFooter = '';


  // ============================================================
  // 🪟 SURFACES / CARDS
  // ============================================================

  Surface1 = '';
  Surface2 = '';
  Surface3 = '';
  Surface4 = '';

  Card = '';
  CardHover = '';
  CardActive = '';

  Backgroundcards = '';
  BackgroundcardsHover = '';


  // ============================================================
  // ▫️ BORDERS
  // ============================================================

  Border1 = '';
  Border2 = '';
  Border3 = '';
  Border4 = '';

  BorderSoft = '';
  BorderStrong = '';


  // ============================================================
  // ✍️ TEXT
  // ============================================================

  TextPrincipal = '';
  TextSecondaire = '';
  TextTertiaire = '';

  TextMuted = '';
  TextDisabled = '';

  TextOnPrimary = '';
  TextOnSecondary = '';


  // ============================================================
  // ✅ SUCCESS
  // ============================================================

  Success = '';
  SuccessHover = '';
  SuccessSoft = '';
  SuccessBorder = '';


  // ============================================================
  // ⚠️ WARNING
  // ============================================================

  Warning = '';
  WarningHover = '';
  WarningSoft = '';
  WarningBorder = '';


  // ============================================================
  // ❌ ERROR
  // ============================================================

  Error = '';
  ErrorHover = '';
  ErrorSoft = '';
  ErrorBorder = '';


  // ============================================================
  // ℹ️ INFO
  // ============================================================

  Info = '';
  InfoHover = '';
  InfoSoft = '';
  InfoBorder = '';


  // ============================================================
  // 🌱 NATURE COLORS
  // ============================================================

  Nature = '';
  NatureSoft = '';

  Leaf = '';
  LeafSoft = '';

  Plant = '';
  PlantSoft = '';


  // ============================================================
  // 🌑 OVERLAYS
  // ============================================================

  Overlay = '';
  OverlayLight = '';
  OverlayDark = '';

  GlassBackground = '';
  GlassBorder = '';


  // ============================================================
  // 🌑 BOX SHADOW
  // ============================================================

  BoxShadow = '';
  BoxShadowSmall = '';
  BoxShadowMedium = '';
  BoxShadowLarge = '';

  BoxShadowPrimary = '';


  // ============================================================
  // 🖼️ IMAGE WELCOME
  // ============================================================

  ImageFondWelcome: string = '';


  // ============================================================
  // 🚀 CONSTRUCTOR
  // ============================================================

  constructor() {

    const storedTheme = localStorage.getItem('theme');

    let isDark: boolean;

    if (storedTheme === 'dark') {

      isDark = true;

    } else if (storedTheme === 'light') {

      isDark = false;

    } else {

      isDark =
        window
          .matchMedia?.('(prefers-color-scheme: dark)')
          ?.matches ?? false;
    }

    this.darkMode.next(isDark);

    this.applyTheme(isDark);
  }


  // ============================================================
  // 🌗 TOGGLE THEME
  // ============================================================

  toggleTheme(): void {

    const newMode = !this.darkMode.value;

    this.darkMode.next(newMode);

    localStorage.setItem(
      'theme',
      newMode ? 'dark' : 'light'
    );

    this.applyTheme(newMode);
  }


  // ============================================================
  // 🎨 APPLY THEME
  // ============================================================

  applyTheme(isDark: boolean): void {

    const html = document.documentElement;

    if (isDark) {

      html.classList.add('dark');

    } else {

      html.classList.remove('dark');
    }

    this.setThemeColors(isDark);
  }


  // ============================================================
  // 🎨 SET THEME COLORS
  // ============================================================

  setThemeColors(isDark: boolean): void {

    // ==========================================================
    // 🌙 DARK MODE
    // ==========================================================

    if (isDark) {

      // --------------------------------------------------------
      // 🌿 PRIMARY
      // --------------------------------------------------------

      this.Primary = '#22C55E';
      this.PrimaryHover = '#16A34A';
      this.PrimaryActive = '#15803D';
      this.PrimarySoft = 'rgba(34, 197, 94, 0.14)';
      this.PrimarySoftHover = 'rgba(34, 197, 94, 0.22)';

      this.BorderPrimary = '#16A34A';


      // --------------------------------------------------------
      // 🎨 SECONDARY
      // --------------------------------------------------------

      this.Secondary = '#86EFAC';
      this.SecondaryHover = '#4ADE80';
      this.SecondarySoft = 'rgba(134, 239, 172, 0.12)';

      this.Accent = '#A3E635';
      this.AccentSoft = 'rgba(163, 230, 53, 0.12)';


      // --------------------------------------------------------
      // 🖥️ BACKGROUNDS
      // --------------------------------------------------------

      this.Background1 = '#18181B';
      this.Background2 = '#202023';
      this.Background3 = '#27272A';
      this.Background4 = '#2F2F33';

      this.BackgroundHero = '#18181B';
      this.BackgroundSection = '#202023';
      this.BackgroundFooter = '#141416';


      // --------------------------------------------------------
      // 🪟 SURFACES
      // --------------------------------------------------------

      this.Surface1 = '#202023';
      this.Surface2 = '#27272A';
      this.Surface3 = '#2F2F33';
      this.Surface4 = '#37373C';

      this.Card = '#202023';
      this.CardHover = '#27272A';
      this.CardActive = '#2F2F33';

      this.Backgroundcards = '#202023';
      this.BackgroundcardsHover = '#27272A';


      // --------------------------------------------------------
      // ▫️ BORDERS
      // --------------------------------------------------------

      this.Border1 = '#1C2026';
      this.Border2 = '#252A31';
      this.Border3 = '#30363E';
      this.Border4 = '#3A414A';

      this.BorderSoft = '#252A31';
      this.BorderStrong = '#3A414A';


      // --------------------------------------------------------
      // ✍️ TEXT
      // --------------------------------------------------------

      this.TextPrincipal = '#F8FAFC';
      this.TextSecondaire = '#A7AFBA';
      this.TextTertiaire = '#7D8794';

      this.TextMuted = '#626B78';
      this.TextDisabled = '#454C56';

      this.TextOnPrimary = '#052E16';
      this.TextOnSecondary = '#052E16';


      // --------------------------------------------------------
      // ✅ SUCCESS
      // --------------------------------------------------------

      this.Success = '#22C55E';
      this.SuccessHover = '#16A34A';
      this.SuccessSoft = 'rgba(34, 197, 94, 0.12)';
      this.SuccessBorder = '#15803D';


      // --------------------------------------------------------
      // ⚠️ WARNING
      // --------------------------------------------------------

      this.Warning = '#F59E0B';
      this.WarningHover = '#D97706';
      this.WarningSoft = 'rgba(245, 158, 11, 0.12)';
      this.WarningBorder = '#B45309';


      // --------------------------------------------------------
      // ❌ ERROR
      // --------------------------------------------------------

      this.Error = '#EF4444';
      this.ErrorHover = '#DC2626';
      this.ErrorSoft = 'rgba(239, 68, 68, 0.12)';
      this.ErrorBorder = '#B91C1C';


      // --------------------------------------------------------
      // ℹ️ INFO
      // --------------------------------------------------------

      this.Info = '#38BDF8';
      this.InfoHover = '#0EA5E9';
      this.InfoSoft = 'rgba(56, 189, 248, 0.12)';
      this.InfoBorder = '#0284C7';


      // --------------------------------------------------------
      // 🌱 NATURE
      // --------------------------------------------------------

      this.Nature = '#22C55E';
      this.NatureSoft = 'rgba(34, 197, 94, 0.12)';

      this.Leaf = '#4ADE80';
      this.LeafSoft = 'rgba(74, 222, 128, 0.12)';

      this.Plant = '#86EFAC';
      this.PlantSoft = 'rgba(134, 239, 172, 0.12)';


      // --------------------------------------------------------
      // 🌑 OVERLAYS
      // --------------------------------------------------------

      this.Overlay = 'rgba(0, 0, 0, 0.45)';
      this.OverlayLight = 'rgba(0, 0, 0, 0.25)';
      this.OverlayDark = 'rgba(0, 0, 0, 0.70)';

      this.GlassBackground = 'rgba(32, 32, 35, 0.82)';
      this.GlassBorder = 'rgba(255, 255, 255, 0.08)';


      // --------------------------------------------------------
      // 🌑 SHADOWS
      // --------------------------------------------------------

      this.BoxShadow =
        '0 8px 20px rgba(0, 0, 0, 0.35)';

      this.BoxShadowSmall =
        '0 4px 12px rgba(0, 0, 0, 0.25)';

      this.BoxShadowMedium =
        '0 12px 30px rgba(0, 0, 0, 0.35)';

      this.BoxShadowLarge =
        '0 25px 60px rgba(0, 0, 0, 0.45)';

      this.BoxShadowPrimary =
        '0 12px 30px rgba(34, 197, 94, 0.18)';


      // --------------------------------------------------------
      // 🖼️ IMAGE
      // --------------------------------------------------------

      this.ImageFondWelcome =
        'assets/ImageFondWelcomeNuit.png';

      return;
    }


    // ==========================================================
    // ☀️ LIGHT MODE
    // ==========================================================

    // ----------------------------------------------------------
    // 🌿 PRIMARY
    // ----------------------------------------------------------

    this.Primary = '#16A34A';
    this.PrimaryHover = '#15803D';
    this.PrimaryActive = '#166534';
    this.PrimarySoft = 'rgba(22, 163, 74, 0.10)';
    this.PrimarySoftHover = 'rgba(22, 163, 74, 0.16)';

    this.BorderPrimary = '#15803D';


    // ----------------------------------------------------------
    // 🎨 SECONDARY
    // ----------------------------------------------------------

    this.Secondary = '#166534';
    this.SecondaryHover = '#14532D';
    this.SecondarySoft = 'rgba(22, 101, 52, 0.08)';

    this.Accent = '#65A30D';
    this.AccentSoft = 'rgba(101, 163, 13, 0.10)';


    // ----------------------------------------------------------
    // 🖥️ BACKGROUNDS
    // ----------------------------------------------------------

    this.Background1 = '#F8FAFC';
    this.Background2 = '#EEF2F6';
    this.Background3 = '#E4E9EF';
    this.Background4 = '#D9E0E8';

    this.BackgroundHero = '#F8FAFC';
    this.BackgroundSection = '#EEF2F6';
    this.BackgroundFooter = '#F1F5F9';


    // ----------------------------------------------------------
    // 🪟 SURFACES
    // ----------------------------------------------------------

    this.Surface1 = '#FFFFFF';
    this.Surface2 = '#F8FAFC';
    this.Surface3 = '#F1F5F9';
    this.Surface4 = '#E2E8F0';

    this.Card = '#FFFFFF';
    this.CardHover = '#F8FAFC';
    this.CardActive = '#F1F5F9';

    this.Backgroundcards = '#FFFFFF';
    this.BackgroundcardsHover = '#F8FAFC';


    // ----------------------------------------------------------
    // ▫️ BORDERS
    // ----------------------------------------------------------

    this.Border1 = '#E5E7EB';
    this.Border2 = '#E2E8F0';
    this.Border3 = '#CBD5E1';
    this.Border4 = '#C7CED8';

    this.BorderSoft = '#E5E7EB';
    this.BorderStrong = '#CBD5E1';


    // ----------------------------------------------------------
    // ✍️ TEXT
    // ----------------------------------------------------------

    this.TextPrincipal = '#111827';
    this.TextSecondaire = '#64748B';
    this.TextTertiaire = '#94A3B8';

    this.TextMuted = '#94A3B8';
    this.TextDisabled = '#CBD5E1';

    this.TextOnPrimary = '#FFFFFF';
    this.TextOnSecondary = '#FFFFFF';


    // ----------------------------------------------------------
    // ✅ SUCCESS
    // ----------------------------------------------------------

    this.Success = '#16A34A';
    this.SuccessHover = '#15803D';
    this.SuccessSoft = 'rgba(22, 163, 74, 0.10)';
    this.SuccessBorder = '#15803D';


    // ----------------------------------------------------------
    // ⚠️ WARNING
    // ----------------------------------------------------------

    this.Warning = '#D97706';
    this.WarningHover = '#B45309';
    this.WarningSoft = 'rgba(217, 119, 6, 0.10)';
    this.WarningBorder = '#B45309';


    // ----------------------------------------------------------
    // ❌ ERROR
    // ----------------------------------------------------------

    this.Error = '#DC2626';
    this.ErrorHover = '#B91C1C';
    this.ErrorSoft = 'rgba(220, 38, 38, 0.10)';
    this.ErrorBorder = '#B91C1C';


    // ----------------------------------------------------------
    // ℹ️ INFO
    // ----------------------------------------------------------

    this.Info = '#0284C7';
    this.InfoHover = '#0369A1';
    this.InfoSoft = 'rgba(2, 132, 199, 0.10)';
    this.InfoBorder = '#0369A1';


    // ----------------------------------------------------------
    // 🌱 NATURE
    // ----------------------------------------------------------

    this.Nature = '#16A34A';
    this.NatureSoft = 'rgba(22, 163, 74, 0.10)';

    this.Leaf = '#22C55E';
    this.LeafSoft = 'rgba(34, 197, 94, 0.10)';

    this.Plant = '#4ADE80';
    this.PlantSoft = 'rgba(74, 222, 128, 0.10)';


    // ----------------------------------------------------------
    // 🌑 OVERLAYS
    // ----------------------------------------------------------

    this.Overlay = 'rgba(15, 23, 42, 0.28)';
    this.OverlayLight = 'rgba(15, 23, 42, 0.12)';
    this.OverlayDark = 'rgba(15, 23, 42, 0.55)';

    this.GlassBackground = 'rgba(255, 255, 255, 0.84)';
    this.GlassBorder = 'rgba(15, 23, 42, 0.08)';


    // ----------------------------------------------------------
    // ☀️ SHADOWS
    // ----------------------------------------------------------

    this.BoxShadow =
      '0 8px 20px rgba(0, 0, 0, 0.18)';

    this.BoxShadowSmall =
      '0 4px 12px rgba(0, 0, 0, 0.10)';

    this.BoxShadowMedium =
      '0 12px 30px rgba(0, 0, 0, 0.12)';

    this.BoxShadowLarge =
      '0 25px 60px rgba(0, 0, 0, 0.15)';

    this.BoxShadowPrimary =
      '0 12px 30px rgba(22, 163, 74, 0.18)';


    // ----------------------------------------------------------
    // 🖼️ IMAGE
    // ----------------------------------------------------------

    this.ImageFondWelcome =
      'assets/ImageFondWelcomeClair.png';
  }


  // ============================================================
  // 🌗 GETTER
  // ============================================================

  get isDarkMode(): boolean {

    return this.darkMode.value;
  }


  // ============================================================
  // ☀️ SET LIGHT MODE
  // ============================================================

  setLightMode(): void {

    this.darkMode.next(false);

    localStorage.setItem(
      'theme',
      'light'
    );

    this.applyTheme(false);
  }


  // ============================================================
  // 🌙 SET DARK MODE
  // ============================================================

  setDarkMode(): void {

    this.darkMode.next(true);

    localStorage.setItem(
      'theme',
      'dark'
    );

    this.applyTheme(true);
  }


  // ============================================================
  // 🔄 RESET THEME
  // ============================================================

  resetTheme(): void {

    localStorage.removeItem('theme');

    const systemPrefersDark =
      window
        .matchMedia?.('(prefers-color-scheme: dark)')
        ?.matches ?? false;

    this.darkMode.next(systemPrefersDark);

    this.applyTheme(systemPrefersDark);
  }
}