import { readFileSync, writeFileSync } from 'fs'

/**
 * A file writer that is locally bound to a file path.
 */
export class BoundFileWriter<A extends AbstractSerializer> {
  constructor(
    private readonly serializer: FileSerializer<A>,
    private readonly file: string
  ) {}

  update(mutator: (input: any) => void) {
    return this.serializer.update(this.file, mutator)
  }

  /**
   * Sets the given field denoted by a path segment (Use dot
   * access expression).
   *
   * @example set('my.custom.field', true)
   *
   * // Result
   * { my: { custom: { field: true } } }
   */
  set(field: string, value: any) {
    const segments = field.split(/\./)
    this.update(object => {
      let current = object
      while (segments.length) {
        const top = segments.shift()
        if (segments.length) {
          if (current[top] == null) {
            current[top] = {}
          }
          current = current[top]
        } else {
          current[top] = value
        }
      }
    })
  }
}

/**
 * Abstract serialization interface.
 */
export interface AbstractSerializer {
  decode<A = {}>(data: string | Buffer): A
  encode<A = {}>(data: A): string | Buffer
}

/**
 * File encoding/decoding abstract interface.
 */
export default class FileSerializer<
  A extends AbstractSerializer = AbstractSerializer
> {
  constructor(private readonly serializer: A) {}

  /**
   * Reads the JSON file.
   */
  read(from: string) {
    return this.serializer.decode(readFileSync(from))
  }

  /**
   * Writes the object as a JSON file.
   */
  write(to: string, object: any) {
    writeFileSync(to, this.serializer.encode(object))
  }

  /**
   * Updates the JSON file, applying the changes.
   */
  update(source: string, mutator: (input: any) => void) {
    const input = this.read(source)
    mutator(input)
    this.write(source, input)
  }

  bound(to: string) {
    return new BoundFileWriter<A>(this, to)
  }
}
