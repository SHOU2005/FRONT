// Simple setup to suppress noisy React 'act' environment warnings during tests
const originalConsoleError = console.error
beforeAll(() => {
  console.error = (...args) => {
    try {
      const message = args[0]
      if (typeof message === 'string' && (message.includes('ReactDOMTestUtils.act') || message.includes('The current testing environment is not configured to support act'))) {
        return
      }
    } catch (e) {
      // fallthrough
    }
    originalConsoleError.apply(console, args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
})

export {}
