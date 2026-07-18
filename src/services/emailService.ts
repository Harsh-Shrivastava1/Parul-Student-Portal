import { delay } from '../mock/db';

export interface EmailApplicationData {
  applicationId: string;
  studentName: string;
  studentEmail: string;
  positionApplied: string;
  department: string;
}

export const emailService = {
  sendApplicationConfirmation: async (data: EmailApplicationData): Promise<void> => {
    await delay(300);
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const subject = 'Application Submitted Successfully | Parul University Internship Portal';

    const body = `
======================================================================
To: ${data.studentEmail}
Subject: ${subject}

Dear ${data.studentName},

Your internship application has been submitted successfully.

Application Details:
--------------------
Application ID  : ${data.applicationId}
Position        : ${data.positionApplied}
Department      : ${data.department}
Submission Date : ${today}
Current Status  : Applied

Your application has been received and is currently under review.

You will receive further updates regarding:
- Shortlisting
- Interview schedule
- Training allocation
- Final confirmation

Track your application status anytime from your Student Dashboard.

Regards,
Parul University Internship Cell
======================================================================
`;

    console.log(body);
  },
};
