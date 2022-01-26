export interface IndexSpecJsParams {
  namespace: string
}

export default function IndexSpecJs({ namespace }: IndexSpecJsParams) {
  return `const { add } = require('./build/Release/${namespace}.node')

describe('Native function invocation', () => {
  it('Should return the sum result', () => {
    expect(add(1, 2)).to.be.eq(3)
  })
  it('Should throw if invalid arguments are provided', () => {
    expect(() => add('a')).to.throw()
  })
})
`
}
