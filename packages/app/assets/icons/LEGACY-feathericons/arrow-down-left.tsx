import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgArrowDownLeft(props: SvgProps) {
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
      className="arrow-down-left_svg__feather arrow-down-left_svg__feather-arrow-down-left"
      {...props}
    >
      <Path d="M17 7L7 17M17 17H7V7" />
    </Svg>
  )
}

export default SvgArrowDownLeft
