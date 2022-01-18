import { PropTypes, styled } from '@tamagui/core'
import { SizableText } from './SizableText'

export type ParagraphProps = PropTypes<typeof Paragraph>

export const Paragraph = styled(SizableText, {
  fontFamily: '$body',
  color: '$color',
  size: '$4',
  selectable: true,
})
