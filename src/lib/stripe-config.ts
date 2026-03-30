// Stripe product and price mappings
export const STRIPE_TIERS = {
  tier_1: {
    name: "Starter",
    monthly_price_id: "price_1TFPjPAXpqphlP6gS3pi4L1e",
    yearly_price_id: "price_1TGiPDAXpqphlP6gLwdhxvGh",
    product_id: "prod_UDrSSJtAPll18T",
    monthly_price: 29,
    yearly_price: 278.40,
    keyword_credits: 50,
    deep_audit_credits: 10,
    max_projects: 3,
  },
  tier_2: {
    name: "Growth",
    monthly_price_id: "price_1TFPjvAXpqphlP6gpwOQdcmZ",
    yearly_price_id: "price_1TGiPfAXpqphlP6glQrjJbEx",
    product_id: "prod_UDrSgaqUoAwkLt",
    monthly_price: 99,
    yearly_price: 950.40,
    keyword_credits: 250,
    deep_audit_credits: 50,
    max_projects: 10,
  },
  tier_3: {
    name: "Scale",
    monthly_price_id: "price_1TFPl9AXpqphlP6gQAa0l0Ec",
    yearly_price_id: "price_1TGiQ2AXpqphlP6gF5XFqtJm",
    product_id: "prod_UDrUXhbiwqJZIo",
    monthly_price: 299,
    yearly_price: 2870.40,
    keyword_credits: 1000,
    deep_audit_credits: 200,
    max_projects: Infinity,
  },
} as const;

export type TierKey = keyof typeof STRIPE_TIERS;
