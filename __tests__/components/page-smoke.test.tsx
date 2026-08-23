import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../../app/page'

test('Page renders the Unit Converter heading', () => {
  render(<Page />)
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: /Unit Converter/i,
    }),
  ).toBeDefined()
})
