import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/app/utils";

export async function GET(
  req: NextRequest,
) {
  const accessToken = await getAccessToken()
  let page = 1;
  let all42KLStudents = await fetch(`https://api.intra.42.fr/v2/locations?filter[active]=true&filter[campus_id]=34&page[size]=100&page[number]=${page}&access_token=${accessToken}`)
  let resJson: Object[] = await all42KLStudents.json()
  let activeUsers: Object[] = []
  
  while (resJson.length !== 0) {
    for (let i = 0; i < resJson.length; i++) {
      activeUsers.push({
        id: resJson[i].user.id,
        login: resJson[i].user.login,
        location: resJson[i].host,
        full_name: resJson[i].user.usual_full_name,
        image: resJson[i].user.image.link,
        wallet: resJson[i].wallet,
        eval_pts: resJson[i].correction_point
      })
    }
    page++;
    all42KLStudents = await fetch(`https://api.intra.42.fr/v2/locations?filter[active]=true&filter[campus_id]=34&page[size]=100&page[number]=${page}&access_token=${accessToken}`)
    resJson = await all42KLStudents.json()
  }

  return NextResponse.json(activeUsers, { status: 200 });
}