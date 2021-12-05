import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgArrowDown(props: SvgProps) {
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
      className="arrow-down_svg__feather arrow-down_svg__feather-arrow-down"
      {...props}
    >
      <Path d="M12 5v14M19 12l-7 7-7-7" />
    </Svg>
  )
}

export default SvgArrowDown
