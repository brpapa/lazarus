import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgLogIn(props: SvgProps) {
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
      className="log-in_svg__feather log-in_svg__feather-log-in"
      {...props}
    >
      <Path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </Svg>
  )
}

export default SvgLogIn
