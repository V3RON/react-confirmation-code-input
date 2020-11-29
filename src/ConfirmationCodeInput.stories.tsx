import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ConfirmationCodeInput } from './ConfirmationCodeInput'

export default {
  component: ConfirmationCodeInput,
  title: 'ConfirmationCodeInput',
  parameters: { actions: { argTypesRegex: '^on.*' } },
}

export const Default = (props) => <ConfirmationCodeInput {...props} />

export const WithAutoFocus = (props) => (
  <ConfirmationCodeInput {...props} autoFocus />
)

export const ReactHookForm = (props) => {
  const { control, handleSubmit } = useForm<{ test: string }>()

  return (
    <form onSubmit={handleSubmit(props.onChange)}>
      <Controller
        name="test"
        control={control}
        defaultValue={''}
        render={(innerProps) => (
          <ConfirmationCodeInput {...props} {...innerProps} />
        )}
      />
      <input type="submit" />
    </form>
  )
}
