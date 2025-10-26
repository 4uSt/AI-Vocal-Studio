import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vocalSessions = pgTable("vocal_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  duration: real("duration").notNull(),
  sampleRate: integer("sample_rate").notNull(),
  bitDepth: integer("bit_depth").notNull(),
  analysis: jsonb("analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const processingChains = pgTable("processing_chains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => vocalSessions.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  mode: text("mode").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const effects = pgTable("effects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chainId: varchar("chain_id").references(() => processingChains.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  order: integer("order").notNull(),
  bypassed: boolean("bypassed").default(false).notNull(),
  parameters: jsonb("parameters").notNull(),
});

export const snapshots = pgTable("snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => vocalSessions.id, { onDelete: "cascade" }).notNull(),
  label: text("label").notNull(),
  chainData: jsonb("chain_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => vocalSessions.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  model: text("model"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVocalSessionSchema = createInsertSchema(vocalSessions).omit({
  id: true,
  createdAt: true,
});

export const insertProcessingChainSchema = createInsertSchema(processingChains).omit({
  id: true,
  createdAt: true,
});

export const insertEffectSchema = createInsertSchema(effects).omit({
  id: true,
});

export const insertSnapshotSchema = createInsertSchema(snapshots).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertVocalSession = z.infer<typeof insertVocalSessionSchema>;
export type VocalSession = typeof vocalSessions.$inferSelect;

export type InsertProcessingChain = z.infer<typeof insertProcessingChainSchema>;
export type ProcessingChain = typeof processingChains.$inferSelect;

export type InsertEffect = z.infer<typeof insertEffectSchema>;
export type Effect = typeof effects.$inferSelect;

export type InsertSnapshot = z.infer<typeof insertSnapshotSchema>;
export type Snapshot = typeof snapshots.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
