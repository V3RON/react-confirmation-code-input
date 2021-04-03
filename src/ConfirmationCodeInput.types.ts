export interface ConfirmationCodeInputProps {
  fields?: number
  className?: string
  onChange?: (value: string) => void
  value?: string
  disabled?: boolean
  autoFocus?: boolean
  regex?: string
}
