import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// Shared with SkinRenew / AiNovaSkin — schema kept in sync (phone column
// included even though GlowVa doesn't write to it, so drizzle push doesn't
// drop it).
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    phone: text("phone"),
    emailConfirmed: boolean("email_confirmed").notNull().default(false),
    marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
  })
);

// Namespaced (`glowva_subscriptions`) so it coexists with SkinRenew's
// `subscriptions` and AiNovaSkin's `ainova_subscriptions` in the same Neon DB.
export const subscriptions = pgTable(
  "glowva_subscriptions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plan: text("plan").notNull(),
    status: text("status").notNull().default("active"),
    intervalDays: integer("interval_days").notNull(),
    pricePerCycleCents: integer("price_per_cycle_cents").notNull(),
    currency: text("currency").notNull().default("USD"),
    cardLast4: text("card_last4"),
    cardBrand: text("card_brand"),
    accessExpiresAt: timestamp("access_expires_at", { withTimezone: true })
      .notNull(),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("glowva_subscriptions_user_idx").on(t.userId),
    statusIdx: index("glowva_subscriptions_status_idx").on(t.status),
  })
);

// Namespaced to keep GlowVa analyses isolated from AiNovaSkin's `analyses`
// table even though the shape is identical.
export const analyses = pgTable(
  "glowva_analyses",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    profile: jsonb("profile").notNull(),
    routine: jsonb("routine").notNull(),
    photoSignature: text("photo_signature"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("glowva_analyses_user_idx").on(t.userId),
    createdIdx: index("glowva_analyses_created_idx").on(t.createdAt),
  })
);

// Namespaced for the same reason as analyses — keeps GlowVa chat history
// separate from AiNovaSkin's `chat_messages`.
export const chatMessages = pgTable(
  "glowva_chat_messages",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("glowva_chat_messages_user_idx").on(t.userId),
    createdIdx: index("glowva_chat_messages_created_idx").on(t.createdAt),
  })
);

// Shared with SkinRenew / AiNovaSkin.
export const passwordResets = pgTable(
  "password_resets",
  {
    token: text("token").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("password_resets_user_idx").on(t.userId),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
