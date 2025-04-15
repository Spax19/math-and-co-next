import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { action, courseId, quizId, answers, bookingId, resourceId } = await req.json();

    // Course Content Data
    // app/api/education/route.js
const courses = {
  wine101: {
    title: "Beginner's Guide to Wine",
    description: "Learn the fundamentals of wine tasting and appreciation",
    materials: {
      pdfs: [
        { id: 'pdf1', title: "Wine Basics Guide", url: "../materials/wine-basics.pdf" },
        { id: 'pdf2', title: "Tasting Methodology", url: "../materials/tasting-guide.pdf" }
      ],
      videos: [
        { id: 'vid1', title: "Introduction to Wine", url: "https://www.youtube.com/watch?v=v2CaqkB28m4" },
        { id: 'vid2', title: "Tasting Techniques", url: "https://www.youtube.com/watch?v=v2CaqkB28m4" }
      ],
      templates: [] // Ensure all expected properties exist
    }
  },
  // Add other courses...
};

    // Quiz Data
    const quizzes = {
      quiz101: {
        questions: [
          {
            id: "q1",
            question: "What is the primary grape in Bordeaux red blends?",
            options: ["Merlot", "Cabernet Sauvignon", "Syrah", "Pinot Noir"],
            correct: "Cabernet Sauvignon"
          },
          {
            id: "q2",
            question: "At what temperature should red wine be served?",
            options: ["45-50°F", "50-55°F", "60-65°F", "70-75°F"],
            correct: "60-65°F"
          }
        ]
      }
    };

    // Wine Type Data
    const wineTypes = {
      red: {
        title: "Red Wine",
        description: "Full-bodied wines typically made from dark-colored grape varieties",
        regions: ["Bordeaux", "Tuscany", "Rioja"],
        servingTemp: "60-65°F",
        popularVarietals: ["Cabernet Sauvignon", "Merlot", "Pinot Noir"]
      },
      // Add white, rose, sparkling similarly
    };

    switch (action) {
      case 'getCourseContent':
        return NextResponse.json({ 
          success: true, 
          content: courses[courseId] || null 
        });

      case 'submitQuiz':
        const quiz = quizzes[quizId];
        const score = quiz.questions.reduce((acc, q) => 
          acc + (answers[q.id] === q.correct ? 1 : 0), 0);
        const percentage = Math.round((score / quiz.questions.length) * 100);
        
        return NextResponse.json({
          success: true,
          score: percentage,
          passed: percentage >= 70,
          certificateUrl: percentage >= 70 ? `/certificates/${Date.now()}.pdf` : null
        });

      case 'getWineTypeInfo':
        return NextResponse.json({
          success: true,
          data: wineTypes[courseId] || null
        });

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// In your API route
return NextResponse.json({ 
  success: true, 
  content: {
    title: courses[courseId]?.title || 'Unknown Course',
    description: courses[courseId]?.description || '',
    materials: {
      pdfs: courses[courseId]?.materials?.pdfs || [],
      videos: courses[courseId]?.materials?.videos || [],
      templates: courses[courseId]?.materials?.templates || []
    }
  } 
});