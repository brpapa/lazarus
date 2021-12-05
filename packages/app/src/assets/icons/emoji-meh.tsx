import * as React from 'react'
import Svg, { SvgProps, Circle, Path } from 'react-native-svg'

function SvgEmojiMeh(props: SvgProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="emoji-meh_svg__feather emoji-meh_svg__feather-meh"
      {...props}
    >
      <Circle cx={12} cy={12} r={10} />
      <Path d="M8 15h8M9 9h.01M15 9h.01" />
    </Svg>
  )
}

export default SvgEmojiMeh
