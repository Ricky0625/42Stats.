export async function getAccessToken() {
  const uid = process.env.UID;
  const secret = process.env.SECRET;
  const url = 'https://api.intra.42.fr/v2/oauth/token'

  const res = await fetch(`${url}?client_id=${uid}&client_secret=${secret}&grant_type=client_credentials`, {
    method: 'POST',
    cache: 'no-store'
  })

  const resJson = await res.json()

  return resJson.access_token
}

export function isDateToday(dateString: string) {
  const inputDate = new Date(dateString);

  const today = new Date();

  return inputDate.getUTCDate() === today.getUTCDate() &&
         inputDate.getUTCMonth() === today.getUTCMonth() &&
         inputDate.getUTCFullYear() === today.getUTCFullYear();
}