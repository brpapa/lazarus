import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgVolume1(props: SvgProps) {
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
      className="volume-1_svg__feather volume-1_svg__feather-volume-1"
      {...props}
    >
      <Path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07" />
    </Svg>
  )
}

export default SvgVolume1
