export default function(validator) {
  let title
  if (validator.description.moniker) {
    title = validator.description.moniker
  } else {
    title = "Anonymous"
  }
  let shortOwner = validator.owner.split(1)[1]
  shortOwner = shortOwner.slice(0, 8)
  title += ` - (${shortOwner})`
  return title
}
