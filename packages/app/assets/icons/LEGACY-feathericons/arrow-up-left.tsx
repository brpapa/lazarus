import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgArrowUpLeft(props: SvgProps) {
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
      className="arrow-up-left_svg__feather arrow-up-left_svg__feather-arrow-up-left"
      {...props}
    >
      <Path d="M17 17L7 7M7 17V7h10" />
    </Svg>
  )
}

export default SvgArrowUpLeft
