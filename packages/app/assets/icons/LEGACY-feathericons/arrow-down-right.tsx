import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgArrowDownRight(props: SvgProps) {
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
      className="arrow-down-right_svg__feather arrow-down-right_svg__feather-arrow-down-right"
      {...props}
    >
      <Path d="M7 7l10 10M17 7v10H7" />
    </Svg>
  )
}

export default SvgArrowDownRight
