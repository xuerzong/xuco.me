import vesperTheme from './vesper-theme.json'

type VesperToken = {
  name: string
  settings?: {
    foreground?: string
  }
}

const colors = vesperTheme.colors
const tokenColors = Object.fromEntries(
  (vesperTheme.tokenColors as VesperToken[])
    .filter((token) => token.settings?.foreground)
    .map((token) => [token.name, token.settings?.foreground])
) as Record<string, string>

export const theme = {
  primary: colors['button.background'],
  'primary-foreground': colors['button.foreground'],
  background: colors['editor.background'],
  foreground: colors['editor.foreground'],
  accent: colors['editorInlayHint.foreground'],
  border: colors['editorHoverWidget.border'],
  success: tokenColors['String, Symbols, Inherited Class'],
  danger: colors['editorError.foreground'],
}

const prismaTheme = {
  'prism-color-background': colors['tab.activeBackground'],
  'prism-color-panel': colors['input.background'],
  'prism-color-border': colors['editorHoverWidget.border'],
  'prism-color-highlight': colors['scrollbarSlider.background'],
  'prism-color-base-primary': colors['editor.foreground'],
  'prism-color-base-secondary': colors['editorInlayHint.foreground'],
  'prism-color-comment': tokenColors['Comment'],
  'prism-color-punctuation': tokenColors['Operator, Misc'],
  'prism-color-property': tokenColors['Variables'],
  'prism-color-function': tokenColors['Function, Special Method'],
  'prism-color-keyword': tokenColors['Keyword, Storage'],
  'prism-color-number': tokenColors['Number, Constant, Function Argument, Tag Attribute, Embedded'],
  'prism-color-string': tokenColors['String, Symbols, Inherited Class'],
  'prism-color-tag': tokenColors['Tag'],
  'prism-color-parameter': tokenColors['Variables'],
  'prism-color-property-access': tokenColors['Sub-methods'],
}

export const themeCssVariables = Object.entries({
  ...theme,
  ...prismaTheme,
}).reduce(
  (acc, [key, value]) => {
    acc[`--${key}`] = value
    return acc
  },
  {} as Record<string, string>
)
