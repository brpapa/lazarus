import * as React from 'react'
import Svg, { SvgProps, Circle, Path } from 'react-native-svg'

function SvgHelpCircle(props: SvgProps) {
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
      className="help-circle_svg__feather help-circle_svg__feather-help-circle"
      {...props}
    >
      <Circle cx={12} cy={12} r={10} />
      <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
    </Svg>
  )
}

export default SvgHelpCircle
