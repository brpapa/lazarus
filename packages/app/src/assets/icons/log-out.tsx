import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgLogOut(props: SvgProps) {
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
      className="log-out_svg__feather log-out_svg__feather-log-out"
      {...props}
    >
      <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </Svg>
  )
}

export default SvgLogOut
