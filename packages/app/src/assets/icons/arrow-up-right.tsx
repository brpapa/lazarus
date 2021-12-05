import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgArrowUpRight(props: SvgProps) {
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
      className="arrow-up-right_svg__feather arrow-up-right_svg__feather-arrow-up-right"
      {...props}
    >
      <Path d="M7 17L17 7M7 7h10v10" />
    </Svg>
  )
}

export default SvgArrowUpRight
