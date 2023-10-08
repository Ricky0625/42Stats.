import * as fs from 'fs';


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

function isMoreThanOneHourAgo(dateString: string) {
  const oneHourInMillis = 3600 * 1000;
  const dateObj = new Date(dateString);
  const currentTime = new Date();

  return (currentTime - dateObj) > oneHourInMillis;
}

async function getAll42KLLogins(access_token: string) {
  let all42KLLogins: string[] = []
  let page = 1;
  while (true) {
    let res = await fetch(`https://api.intra.42.fr/v2/campus/34/users?access_token=${access_token}&page[size]=100&page[number]=${page}&filter[staff?]=false`)
    if (res.ok) {
      let resJson: Object[] = await res.json();
      if (resJson.length === 0) {
        break;
      }

      resJson.forEach((student) => {
        if (student.email && student.email.endsWith('42kl.edu.my')) {
          all42KLLogins.push(student.login)
        }
      })
    }
  }

  return all42KLLogins;
}

async function updateStudentsInfoDB() {
  const access_token = await getAccessToken();
  const all42KLLogins = getAll42KLLogins(access_token)
  let toSerialize = {}


}

export async function getStudentsInfo() {
  try {
    const content = fs.readFileSync('students.json');
    const contentJson = JSON.parse(content)
    return contentJson
  } catch (err) {
    return []
  }
}