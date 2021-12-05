import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgPlus(props: SvgProps) {
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
      className="plus_svg__feather plus_svg__feather-plus"
      {...props}
    >
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

export default SvgPlus
