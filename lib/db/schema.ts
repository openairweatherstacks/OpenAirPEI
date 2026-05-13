import { relations } from "drizzle-orm";
import { bigint, bigserial, boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const reviews = pgTable(
  "reviews",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    locationId: text("location_id").notNull(),
    authorName: text("author_name").notNull(),
    rating: integer("rating").notNull(),
    body: text("body").notNull(),
    approved: boolean("approved").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (t) => ({
    locationIdx: index("reviews_location_approved").on(t.locationId, t.approved),
  }),
);

export const photos = pgTable(
  "photos",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    reviewId: bigint("review_id", { mode: "number" })
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),
    locationId: text("location_id").notNull(),
    storagePath: text("storage_path").notNull(),
    approved: boolean("approved").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (t) => ({
    reviewIdx: index("photos_review_id").on(t.reviewId),
  }),
);

export const reviewsRelations = relations(reviews, ({ many }) => ({
  photos: many(photos),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  review: one(reviews, {
    fields: [photos.reviewId],
    references: [reviews.id],
  }),
}));

export type ReviewSelect = typeof reviews.$inferSelect;
export type PhotoSelect = typeof photos.$inferSelect;
export type ReviewWithPhotos = ReviewSelect & { photos: PhotoSelect[] };
