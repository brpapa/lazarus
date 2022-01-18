import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgWifi(props: SvgProps) {
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
      className="wifi_svg__feather wifi_svg__feather-wifi"
      {...props}
    >
      <Path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
    </Svg>
  )
}

export default SvgWifi