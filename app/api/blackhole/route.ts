import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, isDateToday, getStudentsInfo, getAllBHDays } from "@/app/api/utils";



export async function GET(
  req: NextRequest,
) {
  const searchParams = req.nextUrl.searchParams
  let year = 0;
  let month = 0;
  let all = true;
  const yearStr: string = searchParams.get('batch_year')
  const monthStr: string = searchParams.get('batch_month')
  if (yearStr !== null && monthStr !== null) {
    all = false;
    try {
      year = parseInt(yearStr)
      month = parseInt(monthStr)
    } catch (err) {
      NextResponse.json({'error': 'Invalid params'}, { status: 400 })
    }
  }

  const allBHDays = await getAllBHDays(year, month, all);

  return NextResponse.json(allBHDays, { status: 200 });
}

