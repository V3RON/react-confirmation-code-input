import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfirmationCodeInput } from './ConfirmationCodeInput'

const VALUE = 'abcdefgh'

describe('ConfirmationCodeInput', () => {
  it('renders correctly', () => {
    const { container } = render(<ConfirmationCodeInput />)
    expect(screen.queryAllByRole('textbox')).not.toHaveLength(0)
    expect(container).toMatchSnapshot()
  })

  describe('Props handling', () => {
    it('renders with provided value', () => {
      render(<ConfirmationCodeInput fields={VALUE.length} value={VALUE} />)
      const inputs = screen.queryAllByRole('textbox')

      expect(inputs).toHaveLength(VALUE.length)
      for (let i = 0; i < VALUE.length; i++) {
        expect(inputs[i]).toHaveValue(VALUE[i])
      }
    })

    it('renders only n ("fields" value) inputs', () => {
      const fieldsValue = 12
      render(<ConfirmationCodeInput fields={fieldsValue} />)
      expect(screen.queryAllByRole('textbox')).toHaveLength(fieldsValue)
    })

    it('propagates "disabled" state to children', () => {
      render(<ConfirmationCodeInput disabled />)
      const inputs = screen.queryAllByRole('textbox')

      for (let i = 0; i < inputs.length; i++) {
        expect(inputs[i]).toBeDisabled()
      }
    })
  })

  describe('User interaction', () => {
    const setup = (value?: string) => {
      const onChangeSpy = jest.fn()
      render(
        <ConfirmationCodeInput
          fields={4}
          onChange={onChangeSpy}
          value={value}
        />
      )
      const inputs = screen.queryAllByRole('textbox') as HTMLInputElement[]

      return {
        onChangeSpy,
        inputs,
      }
    }

    it('focuses next input on right arrow click', () => {
      const { inputs } = setup()
      fireEvent.keyDown(inputs[0], { key: 'ArrowRight' })

      expect(
        (document.activeElement as HTMLInputElement | null)?.dataset.index
      ).toEqual(inputs[1].dataset.index)
    })

    it('focuses previous input on left arrow click', () => {
      const { inputs } = setup()
      fireEvent.keyDown(inputs[2], { key: 'ArrowLeft' })

      expect(
        (document.activeElement as HTMLInputElement | null)?.dataset.index
      ).toEqual(inputs[1].dataset.index)
    })

    it('focuses next input after typing', () => {
      const { inputs, onChangeSpy } = setup()
      fireEvent.change(inputs[0], { target: { value: 'a' } })

      expect(
        (document.activeElement as HTMLInputElement | null)?.dataset.index
      ).toEqual(inputs[1].dataset.index)

      fireEvent.change(inputs[1], { target: { value: 'b' } })

      expect(
        (document.activeElement as HTMLInputElement | null)?.dataset.index
      ).toEqual(inputs[2].dataset.index)

      expect(onChangeSpy).toHaveBeenCalledTimes(2)
      expect(onChangeSpy).toHaveBeenLastCalledWith('ab')
    })

    it('focuses previous input when backspace is clicked', () => {
      const { inputs, onChangeSpy } = setup('abcd')
      fireEvent.keyDown(inputs[3], { key: 'Backspace' })

      expect(
        (document.activeElement as HTMLInputElement | null)?.dataset.index
      ).toEqual(inputs[2].dataset.index)
      expect(onChangeSpy).toHaveBeenCalledWith('abc')
    })
  })

  describe('Pattern matching', () => {
    it('should disallow forbidden chars input', () => {
      const onChangeSpy = jest.fn()
      render(
        <ConfirmationCodeInput
          fields={4}
          regex="^[0-9]*$"
          onChange={onChangeSpy}
        />
      )
      const inputs = screen.queryAllByRole('textbox') as HTMLInputElement[]

      inputs[0].focus()
      fireEvent.change(inputs[0], { target: { value: 'A' } })
      expect(
        (document.activeElement as HTMLInputElement | null)?.dataset.index
      ).toEqual(inputs[0].dataset.index)
      expect(onChangeSpy).not.toHaveBeenCalled()

      inputs[0].focus()
      fireEvent.change(inputs[0], { target: { value: '1' } })
      expect(
        (document.activeElement as HTMLInputElement | null)?.dataset.index
      ).toEqual(inputs[1].dataset.index)
      expect(onChangeSpy).toHaveBeenCalled()
    })

    it('should disallow pasting of forbidden content', () => {
      const onChangeSpy = jest.fn()
      render(
        <ConfirmationCodeInput
          fields={4}
          regex="^[0-9]*$"
          onChange={onChangeSpy}
        />
      )
      const inputs = screen.queryAllByRole('textbox') as HTMLInputElement[]

      fireEvent.paste(inputs[1], {
        clipboardData: { getData: () => 'zas' },
      })

      expect(onChangeSpy).toHaveBeenCalledTimes(0)
    })
  })

  it('handles pasting', () => {
    const onChangeSpy = jest.fn()
    render(<ConfirmationCodeInput fields={4} onChange={onChangeSpy} />)
    const inputs = screen.queryAllByRole('textbox') as HTMLInputElement[]

    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => '432' },
    })

    expect(
      (document.activeElement as HTMLInputElement | null)?.dataset.index
    ).toEqual(inputs[2].dataset.index)
    expect(onChangeSpy).toHaveBeenCalledTimes(1)
  })

  it("should warn in development mode about 'value' being too long", () => {
    const startingEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const spy = jest.spyOn(global.console, 'error')
    const { rerender } = render(
      <ConfirmationCodeInput fields={4} value="ABCDEFGH" />
    )

    expect(spy).toHaveBeenCalled()

    process.env.NODE_ENV = 'production'
    rerender(<ConfirmationCodeInput fields={4} value="ABCDEFGH" />)

    process.env.NODE_ENV = startingEnv
  })

  it('should cut provided value to the number of fields', () => {
    const { rerender } = render(
      <ConfirmationCodeInput fields={4} value="ABCD" />
    )

    rerender(<ConfirmationCodeInput fields={2} value="ABCD" />)

    const inputs = screen.queryAllByRole('textbox') as HTMLInputElement[]
    expect(inputs[0]).toHaveValue('A')
    expect(inputs[1]).toHaveValue('B')
    expect(inputs).toHaveLength(2)
  })
})
