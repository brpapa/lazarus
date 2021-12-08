import { GetProps, Text, Variable, styled } from '@tamagui/core'

export type SizableTextProps = GetProps<typeof SizableText>

/** add a single size property to manipulate all of: fontSize, lineHeight, fontWeight, letterSpacing */
export const SizableText = styled(Text, {
  variants: {
    size: {
      '...size': (size, { tokens, props }) => {
        const family = (
          typeof props.fontFamily === 'string'
            ? props.fontFamily
            : props.fontFamily instanceof Variable
            ? props.fontFamily.val
            : props.fontFamily || '$body'
        ) as any

        const font = tokens.font[family]
        if (!font) {
          console.warn('⚠️ no font found on tokens', {
            family,
            fontTokens: Object.keys(tokens.font),
            val: size,
          })
          return {}
        }
        const fontFamily = font.family
        const fontSize = props.fontSize || font.size[size]
        const lineHeight = props.lineHeight || font.lineHeight[size]
        const fontWeight = props.fontWeight || font.weight[size]
        const letterSpacing = props.letterSpacing || font.letterSpacing[size]

        return {
          fontFamily,
          fontWeight,
          letterSpacing,
          fontSize,
          lineHeight,
        }
      },
    },
  },
})
