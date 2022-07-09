import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgMoon(props: SvgProps) {
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
      className="moon_svg__feather moon_svg__feather-moon"
      {...props}
    >
      <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </Svg>
  )
}

export default SvgMoon
