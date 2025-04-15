// src/app/api/education/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure dynamic evaluation

export async function POST(req) {
  try {
    const body = await req.json();
    
    if (!body.action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 }
      );
    }

    const result = await handler(body);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ... keep your existing handler and helper functions ...

async function handler({
  action,
  userId,
  courseId,
  quizId,
  bookingId,
  resourceId,
  answers,
  paymentInfo,
}) {
  const courseContent = {
    wine101: {
      title: "Introduction to Wine",
      materials: {
        pdf: [
          {
            id: "pdf1",
            title: "Wine Basics Guide",
            url: "/materials/wine-basics.pdf",
          },
          {
            id: "pdf2",
            title: "Tasting Methodology",
            url: "/materials/tasting-guide.pdf",
          },
        ],
        videos: [
          {
            id: "vid1",
            title: "Wine Tasting Basics",
            url: "https://example.com/videos/tasting-basics",
          },
          {
            id: "vid2",
            title: "Understanding Wine Regions",
            url: "https://example.com/videos/wine-regions",
          },
        ],
        templates: [
          {
            id: "tmp1",
            title: "Wine Tasting Notes Template",
            url: "/templates/tasting-notes.pdf",
          },
          {
            id: "tmp2",
            title: "Wine Evaluation Form",
            url: "/templates/evaluation.pdf",
          },
        ],
      },
    },
  };

  const quizBank = {
    quiz101: {
      title: "Wine Basics Assessment",
      questions: [
        {
          id: "q1",
          question: "What is the primary grape in Bordeaux red blends?",
          options: ["Merlot", "Cabernet Sauvignon", "Syrah", "Pinot Noir"],
          correct: "Cabernet Sauvignon",
        },
        {
          id: "q2",
          question: "At what temperature should red wine be served?",
          options: ["45-50°F", "50-55°F", "60-65°F", "70-75°F"],
          correct: "60-65°F",
        },
      ],
    },
  };

  const classes = {
    class101: {
      title: "Wine Appreciation Workshop",
      date: "2024-03-15",
      time: "18:00",
      capacity: 20,
      price: 149.99,
      enrolled: [],
    },
  };

  const resources = {
    res101: {
      title: "Advanced Wine Theory",
      type: "pdf",
      accessLevel: "premium",
      downloads: 0,
      url: "/resources/advanced-wine-theory.pdf",
    },
  };

  try {
    switch (action) {
      case "getCourseContent":
        return { success: true, content: courseContent[courseId] || null };

      case "submitQuiz":
        if (!quizBank[quizId] || !answers) {
          return { success: false, error: "Invalid quiz or answers" };
        }
        const questions = quizBank[quizId].questions;
        const score = questions.reduce(
          (acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0),
          0
        );
        const percentage = (score / questions.length) * 100;

        if (percentage >= 70) {
          const certificateUrl = await generateCertificate(userId, quizId);
          return {
            success: true,
            score: percentage,
            passed: true,
            certificateUrl,
          };
        }
        return { success: true, score: percentage, passed: false };

      case "bookClass":
        if (!classes[bookingId] || !paymentInfo) {
          return { success: false, error: "Invalid booking information" };
        }
        const classDetails = classes[bookingId];

        if (classDetails.enrolled.length >= classDetails.capacity) {
          return { success: false, error: "Class is full" };
        }

        const paymentResult = await processPayment(
          paymentInfo,
          classDetails.price
        );
        if (!paymentResult.success) {
          return { success: false, error: "Payment failed" };
        }

        classDetails.enrolled.push(userId);
        await sendConfirmationEmail(userId, classDetails);

        return {
          success: true,
          message: "Booking confirmed",
          details: classDetails,
        };

      case "accessResource":
        if (!resources[resourceId]) {
          return { success: false, error: "Resource not found" };
        }

        const resource = resources[resourceId];
        resource.downloads++;

        return {
          success: true,
          resource: {
            title: resource.title,
            url: resource.url,
            downloads: resource.downloads,
          },
        };

      default:
        return { success: false, error: "Invalid action" };
    }
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while processing your request",
    };
  }
}

async function generateCertificate(userId, quizId) {
  const certificateData = {
    id: `CERT-${userId}-${quizId}-${Date.now()}`,
    date: new Date().toISOString(),
    url: `/certificates/${userId}-${quizId}.pdf`,
  };
  return certificateData.url;
}

async function processPayment(paymentInfo, amount) {
  try {
    const response = await fetch("https://api.stripe.com/v1/charges", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: "usd",
        source: paymentInfo.token,
        description: "Wine Education Class Booking",
      }),
    });

    if (!response.ok) {
      throw new Error("Payment failed");
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function sendConfirmationEmail(userId, classDetails) {
  try {
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: userId }],
          },
        ],
        from: { email: "education@wineestate.com" },
        subject: "Class Booking Confirmation",
        content: [
          {
            type: "text/html",
            value: `
            <h2>Booking Confirmed</h2>
            <p>Your booking for ${classDetails.title} has been confirmed.</p>
            <p>Date: ${classDetails.date}</p>
            <p>Time: ${classDetails.time}</p>
          `,
          },
        ],
      }),
    });
    return true;
  } catch (error) {
    return false;
  }
}