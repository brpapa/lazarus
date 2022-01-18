import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgMinus(props: SvgProps) {
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
      className="minus_svg__feather minus_svg__feather-minus"
      {...props}
    >
      <Path d="M5 12h14" />
    </Svg>
  )
}

export default SvgMinus
