import { NextRequest, NextResponse } from "next/server";
import { getAllBHDays } from "../utils";

type FallenStatsType = {
  validated_last: any[]
  failed_last: any[]
  never_started: number
  end_levels_stats: any[]
  average_end_level: number
}

async function getFallensStats(topN: number | null) {
  // validated last
  // failed last
  // didn't even start (level 0)

  let fallensStats: FallenStatsType = {
    validated_last: [],
    failed_last: [],
    never_started: 0,
    end_levels_stats: [],
    average_end_level: 0
  }

  const allBHDays = await getAllBHDays(0, 0, true);
  let fallens = allBHDays.filter((student: any) => {
    return student.bh_days !== null && student.bh_days < 0;
  });

  fallens.forEach((fallen: any) => {
    if (fallen.cp_level === 0) {
      fallensStats.never_started++;
    } else if (fallen.last_project_before_fall.validated === false) {
      // if failed last project subscribed
      const projectFailedName = fallen.last_project_before_fall.name
      const project: any = fallensStats.failed_last.find((project: any) => {
        return project.name === projectFailedName
      });

      if (project !== undefined) {
        // if project exists in the array
        project.logins.push(fallen.login)
      } else {
        fallensStats.failed_last.push({
          name: projectFailedName,
          logins: [fallen.login]
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
        project.logins.push(fallen.login)
      } else {
        fallensStats.validated_last.push({
          name: projectValidatedName,
          logins: [fallen.login]
        })
      }
    }

    let endLevel = Math.floor(fallen.cp_level);
    const endLevelStat = fallensStats.end_levels_stats.find((stat: any) => {
      return stat.level === endLevel;
    })

    if (endLevelStat !== undefined) {
      endLevelStat.count++;
    } else {
      fallensStats.end_levels_stats.push({
        level: endLevel,
        count: 1
      })
    }

    fallensStats.average_end_level += fallen.cp_level;
  })

  // get average level and round to 1 dp
  fallensStats.average_end_level = Math.round(fallensStats.average_end_level / fallens.length * 10) / 10

  fallensStats.end_levels_stats.sort((l1, l2) => {
    return l1.level - l2.level
  })

  if (topN !== null) {
    // sort and slice the top N
    fallensStats.validated_last.sort((p1, p2) => {
      return p2.logins.length - p1.logins.length
    })
    fallensStats.validated_last = fallensStats.validated_last.slice(0, topN)

    fallensStats.failed_last.sort((p1, p2) => {
      return p2.logins.length - p1.logins.length
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
  let topN: number | null = null

  if (topNStr !== null) {
    try {
      topN = parseInt(topNStr)
    } catch (err) {
      return NextResponse.json({error: 'Invalid params'}, { status: 400 })
    }
  }

  const fallensStats = await getFallensStats(topN)

  return NextResponse.json(fallensStats, { status: 200 });
}