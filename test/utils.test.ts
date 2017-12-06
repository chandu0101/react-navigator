import { removeTrailingForwardSlashes } from '../src/utils'

describe('utils', () => {
  test('removeTrailingForwardSlashes', () => {
    expect(removeTrailingForwardSlashes('dude/')).toBe('dude')
    expect(removeTrailingForwardSlashes('dude//')).toBe('dude')
    expect(removeTrailingForwardSlashes('dude///')).toBe('dude')
    expect(removeTrailingForwardSlashes('dude///2')).toBe('dude///2')
    expect(removeTrailingForwardSlashes('/dude///2')).toBe('/dude///2')
  })
})
