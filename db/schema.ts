import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const tripVideos = sqliteTable('trip_videos', {
  ownerId: text('owner_id').notNull(),
  videoId: text('video_id').notNull(),
  title: text('title').notNull(),
  dayId: text('day_id'),
  createdAt: text('created_at').notNull(),
}, table => [primaryKey({ columns: [table.ownerId, table.videoId] })]);
