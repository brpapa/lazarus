import { Stack, isVariable, styled, PropTypes } from '@tamagui/core'

export type YStackProps = PropTypes<typeof YStack>

export const YStack = styled(Stack, {
  flexDirection: 'column',

  variants: {
    fullscreen: {
      true: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    },

    elevation: {
      '...size': (size, { tokens, theme }) => {
        const token = tokens.size[size]
        const [height, shadowRadius] = (() => {
          if (isVariable(token)) {
            return [+token.val / 3, +token.val / 2] as const
          }
          return [size / 3, size / 2] as const
        })()
        const shadow = {
          shadowColor: theme.shadowColor,
          shadowRadius,
          shadowOffset: { height, width: 0 },
        }
        return shadow
      },
    },
  },
})

export type XStackProps = PropTypes<typeof XStack>

export const XStack = styled(YStack, {
  flexDirection: 'row',
})

export type ZStackProps = PropTypes<typeof ZStack>

export const ZStack = styled(
  YStack,
  {
    position: 'relative',
  },
  {
    neverFlatten: true,
    isZStack: true,
  },
)
