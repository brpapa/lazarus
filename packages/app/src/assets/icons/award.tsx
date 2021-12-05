import * as React from 'react'
import Svg, { SvgProps, Circle, Path } from 'react-native-svg'

function SvgAward(props: SvgProps) {
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
      className="award_svg__feather award_svg__feather-award"
      {...props}
    >
      <Circle cx={12} cy={8} r={7} />
      <Path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </Svg>
  )
}

export default SvgAward
