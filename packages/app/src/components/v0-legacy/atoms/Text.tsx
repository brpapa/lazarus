import { createText } from '@shopify/restyle'
import type { Theme } from '~/shared/theme/v0-legacy'

// The Text component comes with the following Restyle functions: color, opacity, visible, typography, textShadow, spacing. It also includes a variant that picks up styles under the textVariants key in your theme
const Text = createText<Theme>()

Text.defaultProps = {
  variant: 'body',
}

export default Text
