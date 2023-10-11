import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getStudentsInfo } from "@/app/api/utils";

async function getActiveUsersByBatch(activeUsersInfo: any[], year: number | null, month: number | null) {
  const allStudentsInfo = await getStudentsInfo()
  const studentsInfo = allStudentsInfo.filter((student: any) => activeUsersInfo.find(info => student.login === info.login))
  let activeUsers: any[] = []

  studentsInfo.forEach((student: any) => {
    if ((year === null && month === null) || (student.cp_batch_year === year && student.cp_batch_month === month)) {
      activeUsers.push({
        login: student.login,
        location: activeUsersInfo.find(info => info.login === student.login).location,
        full_name: student.full_name,
        image: student.image,
        wallet: student.wallet,
        eval_pts: student.eval_pts,
        bh_days: student.bh_days,
        level: student.cp_level || student.ps_level,
        cp_batch_year: student.cp_batch_year,
        cp_batch_month: student.cp_batch_month,
      })
    }
  })

  return activeUsers
}

export async function GET(
  req: NextRequest,
) {
  const searchParams = req.nextUrl.searchParams
  let year: number | null = null;
  let month: number | null = null;
  const yearStr: string | null = searchParams.get('batch_year')
  const monthStr: string | null = searchParams.get('batch_month')
  if (yearStr !== null && monthStr !== null) {
    year = parseInt(yearStr)
    if (year !== year) {
      NextResponse.json({'error': 'Invalid param batch_year'}, { status: 400 })
    }
    month = parseInt(monthStr)
    if (month !== month) {
      NextResponse.json({'error': 'Invalid param batch_month'}, { status: 400 })
    }
  }

  const accessToken = await getAccessToken()
  let page = 1;
  let all42KLStudents = await fetch(`https://api.intra.42.fr/v2/locations?filter[active]=true&filter[campus_id]=34&page[size]=100&page[number]=${page}&access_token=${accessToken}`)
  let resJson: any[] = await all42KLStudents.json()
  let activeUsersLogin: any[] = []
  
  while (resJson.length !== 0) {
    resJson.forEach((info: any) => {
      activeUsersLogin.push({login: info.user.login, location: info.host})
    })
    page++;
    all42KLStudents = await fetch(`https://api.intra.42.fr/v2/locations?filter[active]=true&filter[campus_id]=34&page[size]=100&page[number]=${page}&access_token=${accessToken}`)
    resJson = await all42KLStudents.json()
  }

  const activeUsers = await getActiveUsersByBatch(activeUsersLogin, year, month);

  return NextResponse.json(activeUsers, { status: 200 });
}