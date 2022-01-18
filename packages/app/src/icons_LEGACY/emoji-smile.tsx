import * as React from 'react'
import Svg, { SvgProps, Circle, Path } from 'react-native-svg'

function SvgEmojiSmile(props: SvgProps) {
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
      className="emoji-smile_svg__feather emoji-smile_svg__feather-smile"
      {...props}
    >
      <Circle cx={12} cy={12} r={10} />
      <Path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </Svg>
  )
}

export default SvgEmojiSmile
