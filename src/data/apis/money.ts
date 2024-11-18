export async function getDollarBlueData () {
  const response = await fetch('https://dolarapi.com/v1/dolares/blue')
  if (!response.ok) {
    throw new Error('Failed to fetch dollar blue data')
  }
  const data = await response.json()
  return data
}
