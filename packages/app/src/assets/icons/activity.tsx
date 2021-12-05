import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgActivity(props: SvgProps) {
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
      className="activity_svg__feather activity_svg__feather-activity"
      {...props}
    >
      <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </Svg>
  )
}

export default SvgActivity
