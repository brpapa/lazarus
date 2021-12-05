import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgArrowUp(props: SvgProps) {
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
      className="arrow-up_svg__feather arrow-up_svg__feather-arrow-up"
      {...props}
    >
      <Path d="M12 19V5M5 12l7-7 7 7" />
    </Svg>
  )
}

export default SvgArrowUp
