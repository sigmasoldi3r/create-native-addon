import { AbstractSerializer } from './FileSerializer'
import * as cson from 'cson'
import { Serializer } from '../services/FileSerializerProvider'

@Serializer('cson')
export default class CsonSerializer implements AbstractSerializer {
  decode<A = {}>(data: string | Buffer): A {
    return cson.parse(data.toString())
  }
  encode<A = {}>(data: A): string | Buffer {
    return cson.stringify(data, null, 2)
  }
}
