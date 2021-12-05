import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgX(props: SvgProps) {
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
      className="x_svg__feather x_svg__feather-x"
      {...props}
    >
      <Path d="M18 6L6 18M6 6l12 12" />
    </Svg>
  )
}

export default SvgX
