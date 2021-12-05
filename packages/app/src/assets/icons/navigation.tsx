import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgNavigation(props: SvgProps) {
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
      className="navigation_svg__feather navigation_svg__feather-navigation"
      {...props}
    >
      <Path d="M3 11l19-9-9 19-2-8-8-2z" />
    </Svg>
  )
}

export default SvgNavigation
