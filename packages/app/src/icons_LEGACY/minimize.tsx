import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgMinimize(props: SvgProps) {
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
      className="minimize_svg__feather minimize_svg__feather-minimize"
      {...props}
    >
      <Path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
    </Svg>
  )
}

export default SvgMinimize
