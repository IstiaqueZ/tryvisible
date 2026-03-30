// Stripe product and price mappings
export const STRIPE_TIERS = {
  tier_1: {
    name: "Starter",
    price_id: "price_1TFPjPAXpqphlP6gS3pi4L1e",
    product_id: "prod_UDrSSJtAPll18T",
    price: 29,
    keyword_credits: 50,
    deep_audit_credits: 10,
    max_projects: 3,
  },
  tier_2: {
    name: "Growth",
    price_id: "price_1TFPjvAXpqphlP6gpwOQdcmZ",
    product_id: "prod_UDrSgaqUoAwkLt",
    price: 99,
    keyword_credits: 250,
    deep_audit_credits: 50,
    max_projects: 10,
  },
  tier_3: {
    name: "Scale",
    price_id: "price_1TFPl9AXpqphlP6gQAa0l0Ec",
    product_id: "prod_UDrUXhbiwqJZIo",
    price: 299,
    keyword_credits: 1000,
    deep_audit_credits: 200,
    max_projects: Infinity,
  },
} as const;

export type TierKey = keyof typeof STRIPE_TIERS;
