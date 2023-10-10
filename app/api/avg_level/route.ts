import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getStudentsInfo } from "@/app/api/utils";

async function getAvgLevelByBatch(year: number, month: number, all: boolean) {
  const studentsInfo = await getStudentsInfo()
  let level = 0;
  let numStudents = 0;

  studentsInfo.forEach((student) => {
    if (student.cp_level !== undefined) {
      if (all || (student.cp_batch_year === year && student.cp_batch_month === month)) {
        level += student.cp_level;
        numStudents++;
      }
    }
  })

  return Math.round(level / numStudents * 10) / 10
}

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

  const avg_level: number = await getAvgLevelByBatch(year, month, all);

  return NextResponse.json({avg_level: avg_level}, { status: 200 });
}