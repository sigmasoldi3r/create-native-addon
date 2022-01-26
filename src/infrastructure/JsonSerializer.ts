import { Serializer } from '../services/FileSerializerProvider'
import { AbstractSerializer } from './FileSerializer'

@Serializer('json')
export default class JsonSerializer implements AbstractSerializer {
  decode<A = {}>(data: string | Buffer): A {
    return JSON.parse(data.toString())
  }
  encode<A = {}>(data: A): string | Buffer {
    return JSON.stringify(data, null, 2)
  }
}
