import { createBox } from '@shopify/restyle'
import type { Theme } from '~/shared/theme'

// The Box component comes with the following Restyle functions: backgroundColor, opacity, visible, layout, spacing, border, shadow, position.
const Box = createBox<Theme>()

export default Box
