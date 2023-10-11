import { NextRequest, NextResponse } from "next/server";
import { getAllBHDays, getStudentsInfo } from "../utils";


function getMonth1stFromDatestring(dateString: string) {
  return dateString.slice(0, 7) + '-01';
}

function getBatchAvgXPTimeline(student: any, batchStudents: any[]) {
  let numStudentsInBatch = 0;
  let batchAvgXpTimeline: any[] = []

  batchStudents.forEach((s: any) => {
    if (s.id !== student.id) {
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


async function getProgressStats(login: string) {
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
  

  return progress
}


export async function GET(
  req: NextRequest,
) {
  const searchParams = req.nextUrl.searchParams
  const login: string | null = searchParams.get('login')

  if (login === null) {
    return NextResponse.json({error: 'Invalid login'}, {status: 400})
  }

  try {
    const studentsProgress = await getProgressStats(login);
    if (studentsProgress.error) {
      return NextResponse.json(studentsProgress, { status: 400 })
    }
    return NextResponse.json(studentsProgress, { status: 200 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({error: 'Invalid login'}, { status: 400 })
  }

}