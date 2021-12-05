import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgThumbsUp(props: SvgProps) {
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
      className="thumbs-up_svg__feather thumbs-up_svg__feather-thumbs-up"
      {...props}
    >
      <Path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
    </Svg>
  )
}

export default SvgThumbsUp
