import { NextRequest, NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { getAllBHDays } from '../utils';
import dns from 'dns';


function resolveMxPromise(domain: string) {
  return new Promise((resolve, reject) => {
      dns.resolveMx(domain, (err, addresses) => {
          if (err) {
              reject(err);
          } else {
              resolve(addresses);
          }
      });
  });
}

async function sendEmail(emailTo: string, content: string) {
  if (!emailTo.match(/^[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+$/i)) {
    throw new Error("Invalid email!")
  }

  const domainName = emailTo.split('@')[1];
  try {
    await resolveMxPromise(domainName)
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
        throw new Error("Cannot send email!");
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch(err) {
    throw new Error("Invalid email!")
  }
}

async function emailAlert(emailTo: string) {
  const bh_days = await getAllBHDays(null, null);
  const inDanger = bh_days.filter((student) => student.bh_days < 10 && student.bh_days >= 0)
  let emailContent = ''
  inDanger.forEach((student) => {
    emailContent += `${student.login}: ${student.bh_days} days left\n`
  })

  await sendEmail(emailTo, emailContent)
}

export async function POST(
  req: NextRequest,
) {
  const payload = await req.json()

  if (payload.email_to) {
    try {
      await emailAlert(payload.email_to);
    } catch (err) {
      return NextResponse.json({ error: "Invalid email!" }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "No email_to provided!" }, { status: 400 });
  }

  return NextResponse.json(payload, { status: 200 });
}