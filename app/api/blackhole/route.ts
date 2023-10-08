import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, isDateToday, getStudentsInfo } from "@/app/utils";
import * as fs from 'fs';
import { createTransport } from 'nodemailer';


function sendEmail(emailTo: string, content: string) {
  if (!emailTo) {
    return
  }
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: emailTo,
    subject: 'Current dangerous cadets (less than 10 days of blackhole days)',
    text: content,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


async function emailAlert() {
  try {
    const content = fs.readFileSync('emailAlert.json');
    const contentJson = JSON.parse(content)
    if (!contentJson.last_sent_date || !isDateToday(contentJson.last_sent_date)) {
      const bh_days = await getAllBHDays(0, 0, true);
      const inDanger = bh_days.filter((student) => student.bh_days < 10 && student.bh_days >= 0)
      let emailContent = ''
      inDanger.forEach((student) => {
        emailContent += `${student.login}: ${student.bh_days} days left\n`
      })
      sendEmail(process.env.ALERT_EMAIL_TO, emailContent)
      fs.writeFileSync('emailAlert.json', JSON.stringify({
        last_sent_date: new Date().toISOString()
      }))
    }
  } catch (err) {
    fs.writeFileSync('emailAlert.json', '{}')
    await emailAlert()
  }
}

async function getAllBHDays(year: number, month: number, all: boolean) {
  const studentsInfo = await getStudentsInfo()
  let students: Object[] = []

  studentsInfo.forEach((student) => {
    if (student.bh_days !== null) {
      if (all || (student.cp_batch_year === year && student.cp_batch_month === month)) {
        students.push(student)
      }
    }
  })

  return students
}

export async function GET(
  req: NextRequest,
) {
  await emailAlert();
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

