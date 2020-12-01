import React, {
  ChangeEventHandler,
  ClipboardEventHandler,
  forwardRef,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ConfirmationCodeInputProps } from './ConfirmationCodeInput.types'

import './ConfirmationCodeInput.css'

export const ConfirmationCodeInput = forwardRef<
  HTMLDivElement,
  ConfirmationCodeInputProps
>((props, ref) => {
  const { fields = 4, className, onChange, value, disabled, autoFocus } = props

  const [input, setInput] = useState<string[]>([])
  const inputRefs = useRef<HTMLInputElement[]>([])

  useEffect(() => {
    if (value == null) {
      return
    }

    if (process.env.NODE_ENV !== 'production') {
      if (value.length > fields) {
        console.error(
          '[ConfirmationCodeInput] Provided value is longer than the number of available inputs!'
        )
      }
    }

    const newInput = new Array(fields)
    for (let i = 0; i < fields; i++) {
      newInput[i] = value[i] || ''
    }
    setInput(newInput)
  }, [value])

  useEffect(() => {
    setInput((currentInput) => {
      if (currentInput.length > fields) {
        return currentInput.slice(0, fields)
      }

      if (currentInput.length < fields) {
        return [
          ...currentInput,
          ...new Array(fields - currentInput.length).fill(''),
        ]
      }

      return currentInput
    })
  }, [fields])

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const char = event.target.value.substr(-1, 1)
    const inputIndex = Number(event.target.dataset['index'])
    const nextInput = inputRefs.current[inputIndex + 1]

    const clonedInput = [...input]
    clonedInput[inputIndex] = char
    setInput(clonedInput)

    if (onChange) {
      onChange(clonedInput.join(''))
    }

    if (nextInput) {
      nextInput.focus()
      nextInput.select()
    }
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    const inputIndex = Number(
      (event.target as HTMLInputElement).dataset['index']
    )
    const prevInput = inputRefs.current[inputIndex - 1]
    const nextInput = inputRefs.current[inputIndex + 1]

    switch (event.key) {
      case 'Backspace': {
        event.preventDefault()

        const clonedInput = [...input]
        clonedInput[inputIndex] = ''
        setInput(clonedInput)

        if (onChange) {
          onChange(clonedInput.join(''))
        }

        if (prevInput) {
          prevInput.focus()
          prevInput.select()
        }

        break
      }
      case 'ArrowLeft': {
        event.preventDefault()

        if (prevInput) {
          prevInput.focus()
          prevInput.select()
        }

        break
      }
      case 'ArrowRight': {
        event.preventDefault()

        if (nextInput) {
          nextInput.focus()
          nextInput.select()
        }

        break
      }
    }
  }

  const handlePaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
    const clipboardValue = event.clipboardData.getData('text/plain')
    const targetInputIndex = Number(
      (event.target as HTMLInputElement).dataset.index
    )

    const newInput = new Array(fields)
    for (let i = 0; i < fields; i++) {
      if (i >= targetInputIndex) {
        newInput[i] = newInput[i - targetInputIndex] || ''
      } else {
        newInput[i] = input[i]
      }
    }
    setInput(newInput)

    if (onChange) {
      onChange(newInput.join(''))
    }

    inputRefs.current[
      Math.min(targetInputIndex + clipboardValue.length, length) - 1
    ].focus()
  }

  return (
    <div ref={ref} className={`ConfirmationCodeInput ${className ?? ''}`}>
      {input.map((char, index) => (
        <input
          className="ConfirmationCodeInput__input"
          autoFocus={autoFocus && index === 0 ? true : undefined}
          key={index}
          maxLength={fields === index + 1 ? 1 : fields}
          data-index={index}
          value={char}
          disabled={disabled}
          ref={(inputRef) => {
            inputRefs.current[index] = inputRef!
          }}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          type="text"
        />
      ))}
    </div>
  )
})
ConfirmationCodeInput.displayName = 'ConfirmationCodeInput'
ConfirmationCodeInput.propTypes = {
  fields: PropTypes.number,
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
}
ConfirmationCodeInput.defaultProps = {
  fields: 4,
}
