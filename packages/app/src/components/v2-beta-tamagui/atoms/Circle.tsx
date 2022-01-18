import { GetProps, Stack, styled } from '@tamagui/core'

export const Circle = styled(Stack, {
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 100_000_000,
  overflow: 'hidden',

  variants: {
    pin: {
      top: {
        position: 'absolute',
        top: 0,
      },
      bottom: {
        position: 'absolute',
        bottom: 0,
      },
    },

    centered: {
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },

    size: {
      '...size': (size, { tokens }) => {
        const sizeVal = tokens.size[size]
        if (!sizeVal) {
          console.warn('⚠️ no size found on tokens', {
            size,
            sizeTokens: Object.keys(tokens.size),
          })
          return {}
        }
        return {
          width: sizeVal,
          height: sizeVal,
        }
      },
    },
  },
})

export type CircleProps = GetProps<typeof Circle>
