async function handler({
  action,
  userId,
  points,
  rewardId,
  profileData,
  purchaseAmount,
  notificationType,
  dateRange,
  eventType,
  socialAction,
  posData,
  eventAttendance,
  reviewData,
}) {
  const TIER_LEVELS = {
    BRONZE: { min: 0, max: 999, multiplier: 1, benefits: ["Basic Rewards"] },
    SILVER: {
      min: 1000,
      max: 4999,
      multiplier: 1.25,
      benefits: ["10% Extra Points", "Priority Tastings"],
    },
    GOLD: {
      min: 5000,
      max: 9999,
      multiplier: 1.5,
      benefits: ["15% Extra Points", "VIP Events"],
    },
    PLATINUM: {
      min: 10000,
      multiplier: 2,
      benefits: ["20% Extra Points", "Exclusive Access"],
    },
  };

  const POINTS_RULES = {
    PURCHASE: 1,
    REVIEW: 50,
    REFERRAL: 500,
    BIRTHDAY: 1000,
    ANNIVERSARY: 750,
    EVENT_ATTENDANCE: 200,
    SOCIAL_SHARE: 100,
    SPECIAL_EVENT: 2000,
    WINE_CLUB_SIGNUP: 2000,
    WINE_REVIEW: 100,
    EVENT_HOST: 1000,
    WORKSHOP_ATTENDANCE: 300,
    MILESTONE_BONUS: 5000,
    CONSECUTIVE_VISITS: 150,
    TASTING_NOTES: 75,
    PROFILE_COMPLETE: 250,
  };

  const REWARDS = {
    WINE_TASTING: { points: 1000, type: "experience", expiry: 90 },
    VINEYARD_TOUR: { points: 2500, type: "experience", expiry: 120 },
    WINE_DISCOUNT: { points: 500, type: "discount", expiry: 30 },
    PRIVATE_EVENT: { points: 5000, type: "experience", expiry: 180 },
    EXCLUSIVE_RELEASE: { points: 7500, type: "product", expiry: 60 },
    PRIVATE_BARREL_TASTING: { points: 10000, type: "experience", expiry: 90 },
    WINEMAKER_DINNER: { points: 15000, type: "experience", expiry: 60 },
    HARVEST_EXPERIENCE: { points: 8000, type: "experience", expiry: 120 },
    LIBRARY_WINE_ACCESS: { points: 12000, type: "product", expiry: 30 },
    CUSTOM_BLEND_SESSION: { points: 20000, type: "experience", expiry: 180 },
  };

  const NOTIFICATION_TEMPLATES = {
    WELCOME: {
      subject: "Welcome to Our Wine Rewards Program",
      template: "welcome",
    },
    TIER_UPGRADE: {
      subject: "Congratulations on Your New Tier!",
      template: "tier-upgrade",
    },
    POINTS_UPDATE: {
      subject: "Your Points Balance Update",
      template: "points-update",
    },
    REWARD_EXPIRY: {
      subject: "Your Reward is Expiring Soon",
      template: "reward-expiry",
    },
    SPECIAL_OFFER: {
      subject: "Exclusive Offer Just for You",
      template: "special-offer",
    },
    MILESTONE_ACHIEVED: {
      subject: "Achievement Unlocked!",
      template: "milestone",
    },
  };

  async function getCurrentPoints(userId) {
    const result = await sql`
      SELECT points_balance 
      FROM user_rewards 
      WHERE user_id = ${userId}
    `;
    return result[0]?.points_balance || 0;
  }

  async function updatePoints(userId, points) {
    await sql`
      INSERT INTO reward_transactions 
      (user_id, points_amount, transaction_type, description)
      VALUES (${userId}, ${points}, 'CREDIT', 'Points earned')
    `;

    await sql`
      UPDATE user_rewards 
      SET points_balance = points_balance + ${points},
          last_activity_date = NOW()
      WHERE user_id = ${userId}
    `;
  }

  async function deductPoints(userId, points) {
    await sql`
      INSERT INTO reward_transactions 
      (user_id, points_amount, transaction_type, description)
      VALUES (${userId}, ${points}, 'DEBIT', 'Points redeemed')
    `;

    await sql`
      UPDATE user_rewards 
      SET points_balance = points_balance - ${points},
          last_activity_date = NOW()
      WHERE user_id = ${userId}
    `;
  }

  async function storeWineReview(userId, reviewData) {
    await sql`
      INSERT INTO user_milestones 
      (user_id, milestone_type, points_awarded, description)
      VALUES (
        ${userId}, 
        'WINE_REVIEW', 
        ${POINTS_RULES.WINE_REVIEW}, 
        ${reviewData.comments || ""}
      )
    `;
  }

  async function getVisitStreak(userId) {
    const result = await sql`
      WITH consecutive_visits AS (
        SELECT 
          created_at,
          LAG(created_at) OVER (ORDER BY created_at) as prev_visit
        FROM reward_transactions
        WHERE user_id = ${userId}
          AND transaction_type = 'VISIT'
        ORDER BY created_at DESC
        LIMIT 30
      )
      SELECT COUNT(*) as streak
      FROM consecutive_visits
      WHERE EXTRACT(DAYS FROM created_at - prev_visit) <= 7
    `;
    return parseInt(result[0]?.streak || 0);
  }

  async function calculateTotalPoints(userId, basePoints, actionType) {
    const result = await sql`
      SELECT tier_level 
      FROM user_rewards 
      WHERE user_id = ${userId}
    `;
    const userTier = result[0]?.tier_level || "BRONZE";
    let multiplier = TIER_LEVELS[userTier].multiplier;
    return Math.floor(basePoints * multiplier);
  }

  switch (action) {
    case "calculatePoints":
      const totalPoints = await calculateTotalPoints(
        userId,
        purchaseAmount * POINTS_RULES.PURCHASE,
        "purchase"
      );
      await updatePoints(userId, totalPoints);
      return { pointsEarned: totalPoints };

    case "processWineReview":
      const reviewPoints = POINTS_RULES.WINE_REVIEW;
      const qualityBonus = reviewData.rating > 3 ? 50 : 0;
      const totalReviewPoints = reviewPoints + qualityBonus;
      await updatePoints(userId, totalReviewPoints);
      await storeWineReview(userId, reviewData);
      return { success: true, pointsEarned: totalReviewPoints };

    case "trackConsecutiveVisits":
      const visitStreak = await getVisitStreak(userId);
      const streakBonus =
        Math.floor(visitStreak / 5) * POINTS_RULES.CONSECUTIVE_VISITS;
      await updatePoints(userId, streakBonus);
      return { success: true, streak: visitStreak, bonus: streakBonus };

    case "redeemReward":
      const reward = REWARDS[rewardId];
      const currentPoints = await getCurrentPoints(userId);
      if (currentPoints >= reward.points) {
        await sql.transaction([
          sql`
            INSERT INTO reward_redemptions 
            (user_id, reward_id, points_spent, status, expiry_date)
            VALUES (
              ${userId}, 
              ${rewardId}, 
              ${reward.points}, 
              'ACTIVE', 
              NOW() + INTERVAL '${reward.expiry} days'
            )
          `,
          sql`
            UPDATE user_rewards 
            SET points_balance = points_balance - ${reward.points}
            WHERE user_id = ${userId}
          `,
        ]);
        return {
          success: true,
          remainingPoints: currentPoints - reward.points,
          reward,
        };
      }
      return { success: false, error: "Insufficient points" };

    default:
      return { error: "Invalid action specified" };
  }
}