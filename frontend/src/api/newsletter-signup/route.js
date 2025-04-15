async function handler({ email, preferences = {}, source = "direct" }) {
  if (!email) {
    return {
      success: false,
      error: "Email is required",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Invalid email format",
    };
  }

  try {
    const discountCode = `WELCOME${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    const signupDate = new Date();

    const subscriberFields = [
      "email",
      "signup_date",
      "source",
      "interests",
      "preferences",
      "discount_code",
      "segment_data",
      "communication_preferences",
      "last_engagement",
    ];

    const segmentData = {
      wineTypes: preferences.wineTypes || [],
      priceRange: preferences.priceRange || "all",
      experience: preferences.experience || "beginner",
      membershipTier: "standard",
    };

    const communicationPrefs = {
      frequency: preferences.frequency || "weekly",
      channels: preferences.channels || ["email"],
      contentTypes: preferences.interests || [],
    };

    const subscriberValues = [
      email,
      signupDate,
      source,
      preferences.interests || [],
      preferences,
      discountCode,
      segmentData,
      communicationPrefs,
      signupDate,
    ];

    await sql.transaction([
      sql(
        `INSERT INTO newsletter_subscribers (${subscriberFields.join(", ")}) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (email) 
         DO UPDATE SET
           preferences = $5,
           segment_data = $7,
           communication_preferences = $8,
           updated_at = NOW()`,
        subscriberValues
      ),

      sql(
        `INSERT INTO signup_sources (source, count, last_signup) 
         VALUES ($1, 1, $2)
         ON CONFLICT (source) 
         DO UPDATE SET 
           count = signup_sources.count + 1,
           last_signup = $2`,
        [source, signupDate]
      ),

      sql(
        `INSERT INTO subscriber_segments (email, segment_name, added_date)
         SELECT $1, unnest($2::text[]), $3`,
        [email, preferences.interests || [], signupDate]
      ),
    ]);

    const welcomeEmailResponse = await fetch(
      "https://api.sendgrid.com/v3/mail/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email }],
              dynamic_template_data: {
                discount_code: discountCode,
                preferences: preferences,
                interests: preferences.interests || [],
                segment_data: segmentData,
                communication_prefs: communicationPrefs,
              },
            },
          ],
          from: {
            email: "winery@example.com",
            name: "Wine Estate",
          },
          template_id: process.env.SENDGRID_WELCOME_TEMPLATE_ID,
        }),
      }
    );

    if (!welcomeEmailResponse.ok) {
      throw new Error("Failed to send welcome email");
    }

    const mailchimpResponse = await fetch(
      `https://${process.env.MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          merge_fields: {
            DISCOUNT: discountCode,
            SOURCE: source,
            INTERESTS: preferences.interests?.join(",") || "",
            WINE_TYPES: segmentData.wineTypes.join(","),
            PRICE_RANGE: segmentData.priceRange,
            EXPERIENCE: segmentData.experience,
          },
          tags: [
            source,
            ...(preferences.interests || []),
            preferences.frequency || "weekly",
            segmentData.experience,
            ...segmentData.wineTypes,
          ],
        }),
      }
    );

    if (!mailchimpResponse.ok) {
      throw new Error("Failed to add subscriber");
    }

    return {
      success: true,
      message: "Successfully subscribed to newsletter",
      discountCode,
      segmentData,
      communicationPrefs,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to process subscription",
    };
  }
}