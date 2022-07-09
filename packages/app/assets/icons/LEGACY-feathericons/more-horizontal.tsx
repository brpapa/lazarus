import * as React from 'react'
import Svg, { SvgProps, Circle } from 'react-native-svg'

function SvgMoreHorizontal(props: SvgProps) {
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
      className="more-horizontal_svg__feather more-horizontal_svg__feather-more-horizontal"
      {...props}
    >
      <Circle cx={12} cy={12} r={1} />
      <Circle cx={19} cy={12} r={1} />
      <Circle cx={5} cy={12} r={1} />
    </Svg>
  )
}

export default SvgMoreHorizontal
