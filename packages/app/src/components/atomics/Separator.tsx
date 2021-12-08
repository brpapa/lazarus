import { Stack, styled } from '@tamagui/core'

export const Separator = styled(Stack, {
  backgroundColor: '$borderColor',
  opacity: 1,
  height: 1,

  variants: {
    // vertical is a boolean variant
    vertical: {
      true: {
        height: 'auto',
        width: 1,
        alignSelf: 'stretch',
        flex: 0,
      },
    },
  },
})