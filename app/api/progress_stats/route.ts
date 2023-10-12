import { NextRequest, NextResponse } from "next/server";
import { getAllBHDays, getStudentsInfo } from "../utils";


function getMonth1stFromDatestring(dateString: string) {
  return dateString.slice(0, 7) + '-01';
}

function getBatchAvgXPTimeline(student: any | null, batchStudents: any[]) {
  let numStudentsInBatch = 0;
  let batchAvgXpTimeline: any[] = []

  batchStudents.forEach((s: any) => {
    if (student == null || s.id !== student.id) {
      if (s.xp_timeline) {
        numStudentsInBatch++;
        s.xp_timeline.forEach((xptl: any) => {
          const date = getMonth1stFromDatestring(xptl.date)
          const xpInfo: any = batchAvgXpTimeline.find((i: any) => {
            return i.date === date
          })

          if (xpInfo) {
            xpInfo.xp += xptl.xp
          } else {
            batchAvgXpTimeline.push({
              xp: xptl.xp,
              date: date
            })
          }
        })
      }
    }
  })

  batchAvgXpTimeline.sort((t1: any, t2: any) => {
    return Date.parse(t1.date) - Date.parse(t2.date)
  })

  for (let i = 0; i < batchAvgXpTimeline.length; ++i) {
    if (i !== 0) {
      batchAvgXpTimeline[i].xp += batchAvgXpTimeline[i - 1].xp
    }
  }

  for (let i = 0; i < batchAvgXpTimeline.length; ++i) {
    batchAvgXpTimeline[i].xp = Math.round(batchAvgXpTimeline[i].xp / numStudentsInBatch);
  }

  fillDateGaps(batchAvgXpTimeline)


  return batchAvgXpTimeline
}


function fillDateGaps(arr: any[]) {
  for (let i = 0; i < arr.length - 1; i++) {
    let currentDate = new Date(arr[i].date);
    let nextDate = new Date(arr[i + 1].date);

    // Check if the next date is not one month after the current date
    let expectedNextDate = new Date(currentDate);
    expectedNextDate.setMonth(expectedNextDate.getMonth() + 1);

    while (expectedNextDate < nextDate) {
      let formattedDate = `${expectedNextDate.getFullYear()}-${String(expectedNextDate.getMonth() + 1).padStart(2, '0')}-01`;
      arr.splice(i + 1, 0, {
        xp: arr[i].xp,
        date: formattedDate
      });
      i++; // Move the pointer due to the newly added date
      expectedNextDate.setMonth(expectedNextDate.getMonth() + 1);
    }
}
}


function getStudentXpTimeline(student: any) {
  let studentXpTimeline: any = []
  student.xp_timeline.forEach((xptl: any) => {
    const date = getMonth1stFromDatestring(xptl.date)
    const xpInfo: any = studentXpTimeline.find((i: any) => {
      return i.date === date
    })

    if (xpInfo) {
      xpInfo.xp += xptl.xp
    } else {
      studentXpTimeline.push({
        xp: xptl.xp,
        date: date
      })
    }
  })

  studentXpTimeline.sort((t1: any, t2: any) => {
    return Date.parse(t1.date) - Date.parse(t2.date)
  })

  for (let i = 0; i < studentXpTimeline.length; ++i) {
    if (i !== 0) {
      studentXpTimeline[i].xp += studentXpTimeline[i - 1].xp
    }
  }

  fillDateGaps(studentXpTimeline)

  return studentXpTimeline
}


async function getProgressStatsByLogin(login: string) {
  const studentsInfo = await getStudentsInfo()

  const student = studentsInfo.find((s: any) => {
    return s.login === login
  })

  if (student === undefined) {
    throw new Error("Invalid login!")
  }

  if (!student.xp_timeline) {
    return {
      error: 'Student does not have any progress yet!'
    }
  }

  student.xp_timeline = getStudentXpTimeline(student)

  let progress: any = {
    student: student,
    batch_avg_xp_timeline: []
  }

  
  const sameBatchStudents = studentsInfo.filter((s: any) => {
    return s.cp_batch_year === student.cp_batch_year && s.cp_batch_month === student.cp_batch_month;
  });
  
  progress.batch_avg_xp_timeline = getBatchAvgXPTimeline(student, sameBatchStudents)

  if (Date.parse(student.xp_timeline[student.xp_timeline.length - 1].date) < Date.parse(progress.batch_avg_xp_timeline[progress.batch_avg_xp_timeline.length - 1].date)) {
    student.xp_timeline.push(JSON.parse(JSON.stringify(progress.batch_avg_xp_timeline[progress.batch_avg_xp_timeline.length - 1])))
    student.xp_timeline[student.xp_timeline.length - 1].xp = student.xp_timeline[student.xp_timeline.length - 2].xp
    fillDateGaps(student.xp_timeline);
  }
  
  if (Date.parse(student.xp_timeline[0].date) > Date.parse(progress.batch_avg_xp_timeline[0].date)) {
    student.xp_timeline.unshift(JSON.parse(JSON.stringify(progress.batch_avg_xp_timeline[0])))
    // student.xp_timeline[0].xp = student.xp_timeline[1].xp
    fillDateGaps(student.xp_timeline);
  }

  return progress
}


async function getProgressStatsByBatch(batchYear1: number, batchMonth1: number, batchYear2: number, batchMonth2: number) {
  const studentsInfo = await getStudentsInfo()

  
  const batch1Students = studentsInfo.filter((s: any) => {
    return s.cp_batch_year === batchYear1 && s.cp_batch_month === batchMonth1;
  });

  const batch2Students = studentsInfo.filter((s: any) => {
    return s.cp_batch_year === batchYear2 && s.cp_batch_month === batchMonth2;
  });

  if (batch1Students === undefined || batch2Students === undefined) {
    return {
      error: "Invalid batch!"
    }
  }
  
  const batch1AvgXpTimeline = getBatchAvgXPTimeline(null, batch1Students)
  const batch2AvgXpTimeline = getBatchAvgXPTimeline(null, batch2Students)
  
  if (Date.parse(batch1AvgXpTimeline[0].date) > Date.parse(batch2AvgXpTimeline[0].date)) {
    batch1AvgXpTimeline.unshift(JSON.parse(JSON.stringify(batch2AvgXpTimeline[0])))
    batch1AvgXpTimeline[0].xp = batch1AvgXpTimeline[1].xp
    fillDateGaps(batch1AvgXpTimeline);
  } else {
    batch2AvgXpTimeline.unshift(JSON.parse(JSON.stringify(batch1AvgXpTimeline[0])))
    batch2AvgXpTimeline[0].xp = batch2AvgXpTimeline[1].xp
    fillDateGaps(batch2AvgXpTimeline);
  }

  if (Date.parse(batch1AvgXpTimeline[batch1AvgXpTimeline.length - 1].date) < Date.parse(batch2AvgXpTimeline[batch2AvgXpTimeline.length - 1].date)) {
    batch1AvgXpTimeline.push(JSON.parse(JSON.stringify(batch2AvgXpTimeline[batch2AvgXpTimeline.length - 1])))
    batch1AvgXpTimeline[batch1AvgXpTimeline.length - 1].xp = batch1AvgXpTimeline[batch1AvgXpTimeline.length - 2].xp
    fillDateGaps(batch1AvgXpTimeline);
  } else {
    batch2AvgXpTimeline.push(JSON.parse(JSON.stringify(batch1AvgXpTimeline[batch1AvgXpTimeline.length - 1])))
    batch2AvgXpTimeline[batch2AvgXpTimeline.length - 1].xp = batch2AvgXpTimeline[batch2AvgXpTimeline.length - 2].xp
    fillDateGaps(batch2AvgXpTimeline);
  }



  return {
    batch1_avg_xp_timeline: batch1AvgXpTimeline,
    batch2_avg_xp_timeline: batch2AvgXpTimeline
  }
}


export async function GET(
  req: NextRequest,
) {
  const searchParams = req.nextUrl.searchParams
  let compBy: string | null = searchParams.get('comp_by')

  if (compBy === null) {
    compBy = 'login'
  }

  if (compBy !== 'login' && compBy !== 'batch') {
    return NextResponse.json({error: 'Invalid Comparing method!'}, { status: 400 })
  }

  if (compBy === 'login') {
    const login: string | null = searchParams.get('login')
    if (login === null) {
      return NextResponse.json({ error: 'No login provided!'}, { status: 400 })
    }

    try {
      const studentsProgress = await getProgressStatsByLogin(login);
      if (studentsProgress.error) {
        return NextResponse.json(studentsProgress, { status: 400 })
      }
      return NextResponse.json(studentsProgress, { status: 200 });
    } catch (err) {
      return NextResponse.json({error: 'Invalid login'}, { status: 400 })
    }
  } else if (compBy === 'batch') {
    let batchYear1: number = parseInt(searchParams.get('batch_year1'));
    if (batchYear1 !== batchYear1) {
      return NextResponse.json({error: 'Invalid param batch_year'}, { status: 400 })
    }
    let batchMonth1: number = parseInt(searchParams.get('batch_month1'));
    if (batchMonth1 !== batchMonth1) {
      return NextResponse.json({error: 'Invalid param batch_month'}, { status: 400 })
    }

    let batchYear2: number = parseInt(searchParams.get('batch_year2'));
    if (batchYear2 !== batchYear2) {
      return NextResponse.json({error: 'Invalid param batch_year'}, { status: 400 })
    }
    let batchMonth2: number = parseInt(searchParams.get('batch_month2'));
    if (batchMonth2 !== batchMonth2) {
      return NextResponse.json({error: 'Invalid param batch_month'}, { status: 400 })
    }

    try {
      const batchsProgress = await getProgressStatsByBatch(batchYear1, batchMonth1, batchYear2, batchMonth2);
      if (batchsProgress.error) {
        return NextResponse.json(batchsProgress, { status: 400 })
      }
      return NextResponse.json(batchsProgress, { status: 200 });
    } catch (err) {
      return NextResponse.json({error: 'Invalid login'}, { status: 400 })
    }
  } else {
    return NextResponse.json({error: 'Invalid Comparing method!'}, { status: 400 })
  }

}