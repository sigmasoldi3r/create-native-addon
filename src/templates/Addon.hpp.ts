export interface AddonHppParams {
  namespace: string
}

export default function AddonHpp({ namespace }: AddonHppParams) {
  return `#pragma once
#include <napi.h>

namespace ${namespace} {

  // Put your public declarations here, if any.

} // END ${namespace}
`
}
