import { getStudentsInfo } from "@/app/api/utils";
import { NextRequest, NextResponse } from "next/server";

async function getAllBatches() {
  const studentsInfo = await getStudentsInfo();
  let batches: Object[] = [];

  studentsInfo.forEach((student) => {
    if (student.bh_days !== null) {
      if (batches.filter(batch => {
        return batch.year === student.cp_batch_year && batch.month === student.cp_batch_month
      }).length === 0) {
        batches.push({
          year: student.cp_batch_year,
          month: student.cp_batch_month,
        })
      }
    }
  })

  batches.sort((batch1, batch2) => {
    if (batch1.year === batch2.year) {
      return batch2.month - batch1.month
    }
    return batch2.year - batch1.year
  })

  return batches
}


export async function GET(
  req: NextRequest,
) {

  const allBatches = await getAllBatches()
  return NextResponse.json(allBatches, { status: 200 });
}