import React from 'react'
import ParsedText from 'react-native-parsed-text'

import { makeUseStyles } from '~/theme/v1'

type Props = {
  textValue: string
}

export function MentionedText(props: Props) {
  const s = useStyles()

  const { textValue } = props

  return (
    <ParsedText
      parse={[
        {
          pattern: /@[A-Za-z0-9._-]*/g,
          style: s.parsedText,
        },
      ]}
    >
      {textValue}
    </ParsedText>
  )
}

const useStyles = makeUseStyles(({ colors, fontVariants }) => ({
  parsedText: {
    color: colors.primary,
    ...fontVariants.bold,
  },
}))
