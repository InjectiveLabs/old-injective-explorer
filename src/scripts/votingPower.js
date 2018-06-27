export default function(validator) {
  let power = validator.pool_shares.amount
  if (power.includes("/")) {
    let divisor = parseInt(power.split("/")[0])
    let dividend = parseInt(power.split("/")[1])
    if (!isFinite(divisor) && !isFinite(dividend)) {
      power = 1
    } else {
      power = Math.round((divisor / dividend) * 100) / 100
    }
  }
  return power + " voting power"
}
