import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgVolume(props: SvgProps) {
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
      className="volume_svg__feather volume_svg__feather-volume"
      {...props}
    >
      <Path d="M11 5L6 9H2v6h4l5 4V5z" />
    </Svg>
  )
}

export default SvgVolume
