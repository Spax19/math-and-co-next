async function handler({
  action,
  eventId,
  userId,
  eventData,
  attendeeData,
  paymentData,
  surveyResponse,
  dateRange,
  emailType,
  searchParams,
}) {
  const EVENT_TYPES = {
    TASTING: "wine_tasting",
    TOUR: "vineyard_tour",
    WORKSHOP: "wine_workshop",
    DINNER: "wine_dinner",
    PRIVATE: "private_event",
  };

  const EMAIL_TEMPLATES = {
    CONFIRMATION: {
      subject: "Event Booking Confirmation",
      template: (event) => `
        <h1>Thank you for booking ${event.title}!</h1>
        <p>Date: ${event.date}</p>
        <p>Time: ${event.time}</p>
        <p>Location: ${event.location}</p>
      `,
    },
    REMINDER: {
      subject: "Event Reminder",
      template: (event) => `
        <h1>Reminder: ${event.title} is tomorrow!</h1>
        <p>We look forward to seeing you at ${event.time}.</p>
      `,
    },
    WAITLIST: {
      subject: "Waitlist Status Update",
      template: (event) => `
        <h1>Waitlist Update for ${event.title}</h1>
        <p>A spot has become available!</p>
      `,
    },
  };

  switch (action) {
    case "createEvent":
      const newEvent = {
        ...eventData,
        currentCapacity: 0,
        maxCapacity: eventData.maxCapacity,
        waitlist: [],
        attendees: [],
        status: "upcoming",
      };
      const createdEvent = await saveEvent(newEvent);
      return { success: true, event: createdEvent };

    case "bookEvent":
      const event = await getEvent(eventId);
      if (!event) return { error: "Event not found" };

      if (event.currentCapacity >= event.maxCapacity) {
        await addToWaitlist(eventId, userId);
        return { success: true, status: "waitlisted" };
      }

      const paymentResult = await processPayment(paymentData);
      if (!paymentResult.success) {
        return { error: "Payment failed" };
      }

      await updateEventCapacity(eventId, event.currentCapacity + 1);
      await addAttendee(eventId, userId, attendeeData);

      await fetch("/api/resend-api-function", {
        method: "POST",
        body: JSON.stringify({
          to: attendeeData.email,
          subject: EMAIL_TEMPLATES.CONFIRMATION.subject,
          html: EMAIL_TEMPLATES.CONFIRMATION.template(event),
        }),
      });

      return { success: true, status: "confirmed" };

    case "checkIn":
      const checkInResult = await markAttendance(eventId, userId, true);
      return { success: true, attendance: checkInResult };

    case "getEventAnalytics":
      const analytics = await generateEventAnalytics(dateRange);
      return {
        attendance: analytics.attendance,
        revenue: analytics.revenue,
        satisfaction: analytics.satisfaction,
        trends: analytics.trends,
      };

    case "submitSurvey":
      await saveSurveyResponse(eventId, userId, surveyResponse);
      return { success: true };

    case "searchEvents":
      const events = await searchEvents(searchParams);
      return { events };

    case "sendEventEmails":
      const attendees = await getEventAttendees(eventId);
      const eventDetails = await getEvent(eventId);
      const emailPromises = attendees.map((attendee) =>
        fetch("/api/resend-api-function", {
          method: "POST",
          body: JSON.stringify({
            to: attendee.email,
            subject: EMAIL_TEMPLATES[emailType].subject,
            html: EMAIL_TEMPLATES[emailType].template(eventDetails),
          }),
        })
      );
      await Promise.all(emailPromises);
      return { success: true };

    default:
      return { error: "Invalid action specified" };
  }

  async function saveEvent(event) {
    const response = await fetch(`${process.env.DB_API}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    return response.json();
  }

  async function getEvent(id) {
    const response = await fetch(`${process.env.DB_API}/events/${id}`);
    return response.json();
  }

  async function updateEventCapacity(id, newCapacity) {
    const response = await fetch(
      `${process.env.DB_API}/events/${id}/capacity`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capacity: newCapacity }),
      }
    );
    return response.json();
  }

  async function addToWaitlist(eventId, userId) {
    const response = await fetch(
      `${process.env.DB_API}/events/${eventId}/waitlist`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }
    );
    return response.json();
  }

  async function processPayment(paymentData) {
    const response = await fetch(`${process.env.PAYMENT_API}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  }

  async function addAttendee(eventId, userId, attendeeData) {
    const response = await fetch(
      `${process.env.DB_API}/events/${eventId}/attendees`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...attendeeData }),
      }
    );
    return response.json();
  }

  async function markAttendance(eventId, userId, attended) {
    const response = await fetch(
      `${process.env.DB_API}/events/${eventId}/attendance`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, attended }),
      }
    );
    return response.json();
  }

  async function generateEventAnalytics(dateRange) {
    const response = await fetch(`${process.env.DB_API}/events/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateRange }),
    });
    return response.json();
  }

  async function saveSurveyResponse(eventId, userId, surveyData) {
    const response = await fetch(
      `${process.env.DB_API}/events/${eventId}/survey`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...surveyData }),
      }
    );
    return response.json();
  }

  async function searchEvents(params) {
    const response = await fetch(`${process.env.DB_API}/events/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  async function getEventAttendees(eventId) {
    const response = await fetch(
      `${process.env.DB_API}/events/${eventId}/attendees`
    );
    return response.json();
  }
}