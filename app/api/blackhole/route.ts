import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, isDateToday } from "@/app/utils";
import * as fs from 'fs';


function getBHDays(dateString: string): number {
  const bhDay = new Date(dateString);
  const currentDate = new Date();
  const daysLeft = (bhDay - currentDate) / (1000 * 60 * 60 * 24)
  // console.log(Math.floor(daysLeft))
  return Math.ceil(daysLeft);
}

async function fetchBHDays() {
  const accessToken = await getAccessToken()
  let page = 1
  let all42KLLogins: string[] = []
  let all42KLStudents = await fetch(`https://api.intra.42.fr/v2/campus/34/users?access_token=${accessToken}&page[size]=100&page[number]=${page}&filter[staff?]=false`)
  let resJson: Object[] = await all42KLStudents.json()
  
  while (resJson.length !== 0) {
    resJson.forEach((student) => {
      all42KLLogins.push(student.login)
    });

    page++;
    all42KLStudents = await fetch(`https://api.intra.42.fr/v2/campus/34/users?access_token=${accessToken}&page[size]=100&page[number]=${page}&filter[staff?]=false`);
    resJson = await all42KLStudents.json()
  }

  let allBHDays : {
    last_update: Date;
    bhDaysInfo: any[];
  }

  allBHDays = {
    last_update: new Date(),
    bhDaysInfo: []
  }

  let totalLeft = all42KLLogins.length

  for (let i = 0; i < all42KLLogins.length; ++i) {
    let login = all42KLLogins[i]
    let res, info;
    try {
      res = await fetch(`https://api.intra.42.fr/v2/users/${login}?access_token=${accessToken}`)
      info = await res.json()
      let cursus_users = info.cursus_users
      if (cursus_users.length > 1 && cursus_users[1].blackholed_at) {
        allBHDays.bhDaysInfo.push({
          login: login,
          bhDays: getBHDays(cursus_users[1].blackholed_at)
        })
      }
    } catch (err) {
    }
    console.log(totalLeft--)
  }

  // let res = await fetch(`https://api.intra.42.fr/v2/users/wxuerui?access_token=${accessToken}`)
  // let info = await res.json()
  // let cursus_users = info.cursus_users
  // if (cursus_users.length == 2) {
  //   allBHDays.bhDaysInfo.push({
  //     login: 'wxuerui',
  //     bhDays: getBHDays(cursus_users[1].blackholed_at)
  //   })
  // }

  return allBHDays
}

async function getAllBHDays() {
  let db;

  try {
    db = fs.readFileSync('./bh.json', 'utf-8')
    let dbJson = JSON.parse(db)
    if (dbJson.last_update && isDateToday(dbJson.last_update)) {
      return dbJson.bhDaysInfo
    } else {
      try {
        const allBHDays = await fetchBHDays()
        fs.writeFileSync('./bh.json', JSON.stringify(allBHDays))
        return allBHDays.bhDaysInfo
      } catch (e) {

      }
    }
  } catch (err) {
    try {
      const allBHDays = await fetchBHDays()
      fs.writeFileSync('./bh.json', JSON.stringify(allBHDays))
      return allBHDays.bhDaysInfo
    } catch (err) {

    }
  }
}

interface User {
  login: string;
  bhDays: number;
}

export async function GET(
  req: NextRequest,
) {

  const allBHDays = await getAllBHDays();
  const inDanger = allBHDays.filter(((user: User) => {
    return user.bhDays < 6 && user.bhDays >= 0
  }))

  return NextResponse.json(inDanger, { status: 200 });
}