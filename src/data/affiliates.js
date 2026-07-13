// 🌐 Affiliate Links Configuration
// Sign up at each program and paste your IDs here.

const AFFILIATES = {
  // Skyscanner — https://www.skyscanner.com/affiliates
  // Your partner ID from the Skyscanner Partner Program
  skyscanner: {
    enabled: false,
    partnerId: "", // e.g. "YOUR_PARTNER_ID"
    url: (dest) =>
      `https://www.skyscanner.net/transport/flights/to/${encodeURIComponent(dest.name.split(",")[0].trim())}/?partner=${encodeURIComponent("YOUR_PARTNER_ID")}`,
  },

  // Booking.com — https://partner.booking.com
  // Your affiliate ID from the Booking.com Affiliate Program
  booking: {
    enabled: false,
    affiliateId: "", // e.g. "123456"
    url: (dest) =>
      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(dest.name.split(",")[0].trim())}&aid=${encodeURIComponent("YOUR_AFFILIATE_ID")}`,
  },

  // Viator — https://www.viator.com/affiliates
  // Your MID (Merchant ID) from the Viator Affiliate Program
  viator: {
    enabled: false,
    mid: "", // e.g. "12345"
    url: (dest) =>
      `https://www.viator.com/${encodeURIComponent(dest.country.replace(/\s+/g, ""))}/d-${encodeURIComponent("YOUR_MID")}/things-to-do-in-${encodeURIComponent(dest.name.split(",")[0].trim().replace(/\s+/g, "-"))}?pid=${encodeURIComponent("YOUR_MID")}`,
  },
};

export default AFFILIATES;
