import * as React from 'react'
import Svg, { SvgProps, Path, Rect } from 'react-native-svg'

function SvgVideo(props: SvgProps) {
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
      className="video_svg__feather video_svg__feather-video"
      {...props}
    >
      <Path d="M23 7l-7 5 7 5V7z" />
      <Rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
    </Svg>
  )
}

export default SvgVideo
