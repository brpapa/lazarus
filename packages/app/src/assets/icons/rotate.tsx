import * as React from 'react'
import Svg, { SvgProps, Circle, Path, Polyline } from 'react-native-svg'

function SvgSearch(props: SvgProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      class="feather feather-rotate-ccw"
      {...props}
    >
      <Polyline points="1 4 1 10 7 10" />
      <Path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </Svg>
  )
}

export default SvgSearch
