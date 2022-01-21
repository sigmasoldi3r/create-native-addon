export default interface PackageManagerProvider {
  init(cwd: string): Promise<void>
}
