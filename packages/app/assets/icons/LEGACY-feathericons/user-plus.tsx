import * as React from 'react'
import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

function SvgUserPlus(props: SvgProps) {
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
      className="user-plus_svg__feather user-plus_svg__feather-user-plus"
      {...props}
    >
      <Path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <Circle cx={8.5} cy={7} r={4} />
      <Path d="M20 8v6M23 11h-6" />
    </Svg>
  )
}

export default SvgUserPlus
