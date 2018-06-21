import { orderBy } from "lodash"
export default function(validators) {
  if (validators && validators.length > 1) {
    return orderBy(
      validators,
      [i => i.description.moniker.toLowerCase()],
      "asc"
    )
  } else {
    return []
  }
}
