import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, isDateToday, getStudentsInfo, getAllBHDays } from "@/app/api/utils";



export async function GET(
  req: NextRequest,
) {
  const searchParams = req.nextUrl.searchParams
  let batchYear: number | null = null;
  let batchMonth: number | null = null;
  const batchYearStr: string | null = searchParams.get('batch_year')
  const batchMonthStr: string | null = searchParams.get('batch_month')
  if (batchYearStr !== null && batchMonthStr !== null) {
    batchYear = parseInt(batchYearStr)
    if (batchYear !== batchYear) {
      return NextResponse.json({error: 'Invalid param batch_year'}, { status: 400 })
    }
    batchMonth = parseInt(batchMonthStr)
    if (batchMonth !== batchMonth) {
      return NextResponse.json({error: 'Invalid param batch_month'}, { status: 400 })
    }
  }

  const allBHDays = await getAllBHDays(batchYear, batchMonth);

  return NextResponse.json(allBHDays, { status: 200 });
}

