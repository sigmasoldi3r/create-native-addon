import { Service } from 'typedi'
import * as info from '../../package.json'

@Service()
export default class ProjectInfo {
  readonly version = info.version
}
