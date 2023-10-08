import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getStudentsInfo } from "@/app/utils";

function getNDaysAgoDate(n: number) {
  let date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString()
}


function getTimePassedInSeconds(begin, end) {
  const date1 = new Date(begin);

  let date2: Date;
  if (end === null) {
    date2 = new Date()
  } else {
    date2 = new Date(end);
  }

  // Get the difference in milliseconds
  const differenceInMilliseconds = Math.abs(date2 - date1);

  // Convert the difference to seconds
  const differenceInSeconds = differenceInMilliseconds / 1000;

  return differenceInSeconds;
}


export async function GET(
  req: NextRequest,
) {
  const searchParams = req.nextUrl.searchParams
  const topN = parseInt(searchParams.get('n'))
  if (!topN) {
    return NextResponse.json({'error': 'Invalid params'}, { status: 400 });
  }
  const accessToken = await getAccessToken()
  let page = 1;
  const beginTime = getNDaysAgoDate(7)
  const endTime = getNDaysAgoDate(0)
  let allLoginSessions = await fetch(`https://api.intra.42.fr/v2/campus/34/locations?page[size]=100&page[number]=${page}&range[begin_at]=${beginTime},${endTime}&access_token=${accessToken}`)
  if (!allLoginSessions.ok) {
    return NextResponse.json({'error': 'Error'}, { status: 400 });
  }
  let loginSessionsJson: Object[] = await allLoginSessions.json()
  let usersLoginTime: Object[] = []

  const allStudentsInfo = await getStudentsInfo()
  
  while (loginSessionsJson.length !== 0) {
    loginSessionsJson.forEach((sessionInfo) => {
      const userLoginInfo = usersLoginTime.find((user) => user.id === sessionInfo.user.id)
      if (userLoginInfo === undefined) {
        let studentInfo = allStudentsInfo.find(info => info.login === sessionInfo.user.login);
        usersLoginTime.push({
          id: sessionInfo.user.id,
          login: sessionInfo.user.login,
          full_name: sessionInfo.user.usual_full_name,
          image: sessionInfo.user.image.link,
          eval_pts: sessionInfo.user.correction_point,
          wallet: sessionInfo.user.wallet,
          location: sessionInfo.host,
          bh_days: studentInfo.bh_days,
          cp_batch_year: studentInfo.cp_batch_year,
          cp_batch_month: studentInfo.cp_batch_month,
          level: studentInfo.cp_level || studentInfo.ps_level,
          login_time: getTimePassedInSeconds(sessionInfo.begin_at, sessionInfo.end_at),
        })
      } else {
        userLoginInfo.login_time += getTimePassedInSeconds(sessionInfo.begin_at, sessionInfo.end_at);
      }
    })
    page++;
    allLoginSessions = await fetch(`https://api.intra.42.fr/v2/campus/34/locations?page[size]=100&page[number]=${page}&range[begin_at]=${beginTime},${endTime}&access_token=${accessToken}`)
    loginSessionsJson = await allLoginSessions.json()
  }
  
  usersLoginTime.forEach((user) => {
    user.login_time = Math.round(user.login_time / 3600 * 10) / 10
  })

  usersLoginTime.sort((user1, user2) => {
    return user2.login_time - user1.login_time
  });

  const topUsersLoginTime = usersLoginTime.slice(0, topN);

  return NextResponse.json(topUsersLoginTime, { status: 200 });
}