import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/app/utils";

export async function GET(
  req: NextRequest,
) {
  const accessToken = await getAccessToken()
  const all42KLStudents = await fetch(`https://api.intra.42.fr/v2/campus/34/users?access_token=${accessToken}&page[size]=100&page[number]=3`)
  const resJson: Object[] = await all42KLStudents.json()
  
  for (let i = 0; i < resJson.length; i++) {
    console.log(resJson[i]['active?'])
  }
  let activeUsers = resJson.filter((user) => (user['location'] !== null))
  return NextResponse.json(activeUsers, { status: 200 });
}