import { RegisterOptions } from 'react-hook-form'
import { t } from '@metis/shared'
import { settings } from './settings'

const { minUsernameLength, maxUsernameLength, minPasswordLength, fullNameRequired } = settings

type Rule = Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>

export function getTextInputRules() {
  const emailInputRules: Rule = {
    required: true,
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: t('errors.invalidEmailAddress'),
    },
  }
  const usernameInputRules: Rule = {
    required: true,
    minLength: minUsernameLength && {
      value: minUsernameLength,
      message: t('errors.usernameMinLengthNotReached', {
        minLength: minUsernameLength,
      }),
    },
    maxLength: maxUsernameLength && {
      value: maxUsernameLength,
      message: t('errors.usernameMaxLengthExceeded', {
        maxLength: maxUsernameLength,
      }),
    },
  }
  const nameInputRules: Rule = { required: fullNameRequired }
  const passwordInputRules: Rule = {
    required: true,
    minLength: minPasswordLength && {
      value: minPasswordLength,
      message: t('errors.passwordMinLengthNotReached', {
        minLength: minPasswordLength,
      }),
    },
  }
  return { emailInputRules, usernameInputRules, nameInputRules, passwordInputRules }
}
