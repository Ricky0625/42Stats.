import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, isDateToday, getStudentsInfo } from "@/app/utils";

async function getAllBHDays(year: number, month: number, all: boolean) {
  const studentsInfo = await getStudentsInfo()
  let students: Object[] = []

  studentsInfo.forEach((student) => {
    if (student.bh_days !== null) {
      if (all || student.cp_batch_year === year && student.cp_batch_month === month) {
        students.push(student)
      }
    }
  })

  return students
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
  if (yearStr !== undefined && monthStr !== undefined) {
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

