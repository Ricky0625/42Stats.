import { NextRequest, NextResponse } from "next/server";
import { getAllBHDays } from "../utils";


async function getFallensStats(topN: number | null, batchYear: number| null, batchMonth: number | null) {
  // validated last
  // failed last
  // didn't even start (level 0)

  let fallensStats: any = {
    validated_last: [],
    failed_last: [],
    never_started: [],
    end_levels_stats: [],
    average_end_level: 0
  }

  const allBHDays = await getAllBHDays(batchYear, batchMonth);

  const fallens = allBHDays.filter((student: any) => {
    return student.bh_days !== null && student.bh_days < 0;
  });

  fallens.forEach((fallen: any) => {
    if (fallen.cp_level === 0) {
      fallensStats.never_started.push(fallen);
    } else if (fallen.last_project_before_fall.validated === false) {
      // if failed last project subscribed
      const projectFailedName = fallen.last_project_before_fall.name
      const project: any = fallensStats.failed_last.find((project: any) => {
        return project.name === projectFailedName
      });

      if (project !== undefined) {
        // if project exists in the array
        project.students.push(fallen)
      } else {
        fallensStats.failed_last.push({
          name: projectFailedName,
          students: [fallen]
        })
      }
    } else if (fallen.last_project_before_fall.validated === true) {
      // if last project subscribed validated
      const projectValidatedName = fallen.last_project_before_fall.name
      const project: any = fallensStats.validated_last.find((project: any) => {
        return project.name === projectValidatedName
      });

      if (project !== undefined) {
        // if project exists in the array
        project.students.push(fallen)
      } else {
        fallensStats.validated_last.push({
          name: projectValidatedName,
          students: [fallen]
        })
      }
    }

    let endLevel = Math.floor(fallen.cp_level);
    const endLevelStat = fallensStats.end_levels_stats.find((stat: any) => {
      return stat.level === endLevel;
    })

    if (endLevelStat !== undefined) {
      endLevelStat.students.push(fallen);
    } else {
      fallensStats.end_levels_stats.push({
        level: endLevel,
        students: [fallen]
      })
    }

    fallensStats.average_end_level += fallen.cp_level;
  })

  // get average level and round to 1 dp
  fallensStats.average_end_level = Math.round(fallensStats.average_end_level / fallens.length * 10) / 10

  fallensStats.end_levels_stats.sort((l1: any, l2: any) => {
    return l1.level - l2.level
  })

  if (topN !== null) {
    // sort and slice the top N
    fallensStats.validated_last.sort((p1: any, p2: any) => {
      return p2.students.length - p1.students.length
    })
    fallensStats.validated_last = fallensStats.validated_last.slice(0, topN)

    fallensStats.failed_last.sort((p1: any, p2: any) => {
      return p2.students.length - p1.students.length
    })
    fallensStats.failed_last = fallensStats.failed_last.slice(0, topN)
  }

  return fallensStats
}


export async function GET(
  req: NextRequest,
) {
  const searchParams = req.nextUrl.searchParams
  const topNStr: string | null = searchParams.get('n')
  const batchYearStr: string | null = searchParams.get('batch_year')
  const batchMonthStr: string | null = searchParams.get('batch_month')
  let topN: number | null = null
  let batchYear: number | null = null
  let batchMonth: number | null = null

  if (topNStr !== null) {
    topN = parseInt(topNStr)
    if (topN !== topN) {
      return NextResponse.json({error: 'Invalid param n'}, { status: 400 })
    }
  }

  if (batchMonthStr !== null && batchYearStr !== null) {
    batchYear = parseInt(batchYearStr)
    if (batchYear !== batchYear) {
      return NextResponse.json({error: 'Invalid param batch_year'}, { status: 400 })
    }
    batchMonth = parseInt(batchMonthStr)
    if (batchMonth !== batchMonth) {
      return NextResponse.json({error: 'Invalid param batch_month'}, { status: 400 })
    }
  }

  const fallensStats = await getFallensStats(topN, batchYear, batchMonth);

  return NextResponse.json(fallensStats, { status: 200 });
}