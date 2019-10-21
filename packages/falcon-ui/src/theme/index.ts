import CSS from 'csstype';
import { Keyframes } from '@emotion/serialize';
import { defaultBaseTheme } from './theme';
import { PropsMappings } from './responsiveprops';
import { mergeThemes } from './utils';

export function createTheme(themeOverride: RecursivePartial<Theme> = {}): Theme {
  return mergeThemes(defaultBaseTheme, themeOverride);
}

// export themed component factory
export * from './themed';

export * from './utils';

export * from './responsiveprops';

// --- exported type definitions for theme  ----
export interface Theme {
  colors: ThemeColors;
  breakpoints: ThemeBreakpoints;
  spacing: ThemeSpacing;
  fonts: ThemeFonts;
  fontSizes: ThemeFontSizes;
  fontWeights: ThemeFontWeights;
  lineHeights: ThemeLineHeights;
  letterSpacings: ThemeLetterSpacings;
  borders: ThemeBorders;
  borderRadius: ThemeBorderRadius;
  boxShadows: ThemeBoxShadows;
  easingFunctions: ThemeEasingFunctions;
  transitionDurations: ThemeTransitionDurations;
  keyframes: ThemeKeyframes;
  zIndex: ThemeZIndex;
  components: ThemeComponents;
  icons: ThemedIcons;
}

export type ThemedIcons = {
  [name: string]: {
    icon: React.ComponentType | ((props: any) => JSX.Element);
  } & ThemedComponentProps;
};

type ThemedPropMapping = {
  themeProp: keyof Theme;
};

type CssProps = CSS.PropertiesFallback<number | string>;

type ResponsivePropMapping = {
  cssProp: keyof CssProps;
};

export type RecursivePartial<T> = { [key in keyof T]?: RecursivePartial<T[key]> };

type CSSPseudoObject = {
  [key in CSS.SimplePseudos]?: CSSObject;
};
type CssOtherProps = undefined | number | string | CSSObject;
type CSSOthersObject = {
  [propertiesName: string]: CssOtherProps | CssOtherProps[];
};
type CssResponsiveProps = {
  [key in keyof CssProps]?: { [Breakpoint in keyof Theme['breakpoints']]?: CssProps[key] } | CssProps[key];
};

export interface CSSObject extends CssResponsiveProps, CSSPseudoObject, CSSOthersObject {}

export type PropsWithTheme<TProps> = TProps & { theme: Theme };

type ThemePropMap<TProp extends keyof PropsMappings> = PropsMappings[TProp] extends ThemedPropMapping
  ? Extract<keyof Theme[PropsMappings[TProp]['themeProp']], string>
  : PropsMappings[TProp] extends ResponsivePropMapping
  ? CssProps[PropsMappings[TProp]['cssProp']]
  : (string | number);

export type BaseThemingProps = {
  [TProp in keyof PropsMappings]?:
    | ThemePropMap<TProp>
    | { [TBreakpoint in keyof ThemeBreakpoints]?: ThemePropMap<TProp> };
};
export type InlineCss<TProps> = ((props: PropsWithTheme<TProps>) => CSSObject) | CSSObject;

export type PropsWithInlineCss<TProps> = TProps & { css?: InlineCss<TProps> };

export interface ThemedComponentProps<TProps = {}> extends BaseThemingProps {
  css?: InlineCss<TProps>;
}

// TODO: use below type instead of `ThemedComponentProps<TProps>`
// export type WithThemedComponentProps<TProps> = PropsWithInlineCss<
//   {
//     variant?: string;
//     defaultTheme?: ComponentTheme<TProps> | { [name: string]: ComponentTheme<TProps> };
//   } & TProps &
//     BaseThemingProps
// >;

export type ComponentTheme<TProps> = {
  variants?: {
    [variantKey: string]: ThemedComponentProps<TProps>;
  };
} & ThemedComponentProps<TProps>;

export interface ThemeComponents {
  [key: string]: ComponentTheme<{}>;
}
type NumberOrStringValues<T> = { readonly [P in keyof T]: number | string };

type Colors = typeof defaultBaseTheme.colors;
export interface ThemeColors extends Colors {}

type Breakpoints = NumberOrStringValues<typeof defaultBaseTheme.breakpoints>;
export interface ThemeBreakpoints extends Breakpoints {}

type Spacing = NumberOrStringValues<typeof defaultBaseTheme.spacing>;
export interface ThemeSpacing extends Spacing {}

type Fonts = typeof defaultBaseTheme.fonts;
export interface ThemeFonts extends Fonts {}

type FontSizes = NumberOrStringValues<typeof defaultBaseTheme.fontSizes>;
export interface ThemeFontSizes extends FontSizes {}

type FontWeights = typeof defaultBaseTheme.fontWeights;
export interface ThemeFontWeights extends FontWeights {}

type LineHeights = NumberOrStringValues<typeof defaultBaseTheme.lineHeights>;
export interface ThemeLineHeights extends LineHeights {}

type LetterSpacings = NumberOrStringValues<typeof defaultBaseTheme.letterSpacings>;
export interface ThemeLetterSpacings extends LetterSpacings {}

type Borders = typeof defaultBaseTheme.borders;
export interface ThemeBorders extends Borders {}

type BorderRadius = NumberOrStringValues<typeof defaultBaseTheme.borderRadius>;
export interface ThemeBorderRadius extends BorderRadius {}

type BoxShadows = typeof defaultBaseTheme.boxShadows;
export interface ThemeBoxShadows extends BoxShadows {}

type EasingFunctions = typeof defaultBaseTheme.easingFunctions;
export interface ThemeEasingFunctions extends EasingFunctions {}

type TransitionDurations = typeof defaultBaseTheme.transitionDurations;
export interface ThemeTransitionDurations extends TransitionDurations {}

export interface ThemeKeyframes {
  [key: string]: CSSObject | Keyframes;
}

type ZIndex = typeof defaultBaseTheme.zIndex;
export interface ThemeZIndex extends ZIndex {}
