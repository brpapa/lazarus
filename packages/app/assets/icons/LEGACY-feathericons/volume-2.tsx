import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgVolume2(props: SvgProps) {
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
      className="volume-2_svg__feather volume-2_svg__feather-volume-2"
      {...props}
    >
      <Path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
    </Svg>
  )
}

export default SvgVolume2
