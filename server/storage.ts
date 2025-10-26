import { 
  type VocalSession, 
  type InsertVocalSession,
  type ProcessingChain,
  type InsertProcessingChain,
  type Effect,
  type InsertEffect,
  type Snapshot,
  type InsertSnapshot,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createVocalSession(session: InsertVocalSession): Promise<VocalSession>;
  getVocalSession(id: string): Promise<VocalSession | undefined>;
  getAllVocalSessions(): Promise<VocalSession[]>;
  updateVocalSessionAnalysis(id: string, analysis: any): Promise<VocalSession | undefined>;
  
  createProcessingChain(chain: InsertProcessingChain): Promise<ProcessingChain>;
  getProcessingChainsBySession(sessionId: string): Promise<ProcessingChain[]>;
  getActiveChain(sessionId: string): Promise<ProcessingChain | undefined>;
  updateChainActiveStatus(chainId: string, isActive: boolean): Promise<ProcessingChain | undefined>;
  
  createEffect(effect: InsertEffect): Promise<Effect>;
  getEffectsByChain(chainId: string): Promise<Effect[]>;
  updateEffect(id: string, updates: Partial<InsertEffect>): Promise<Effect | undefined>;
  deleteEffect(id: string): Promise<boolean>;
  
  createSnapshot(snapshot: InsertSnapshot): Promise<Snapshot>;
  getSnapshotsBySession(sessionId: string): Promise<Snapshot[]>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private vocalSessions: Map<string, VocalSession>;
  private processingChains: Map<string, ProcessingChain>;
  private effects: Map<string, Effect>;
  private snapshots: Map<string, Snapshot>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.vocalSessions = new Map();
    this.processingChains = new Map();
    this.effects = new Map();
    this.snapshots = new Map();
    this.chatMessages = new Map();
  }

  async createVocalSession(insertSession: InsertVocalSession): Promise<VocalSession> {
    const id = randomUUID();
    const session: VocalSession = {
      ...insertSession,
      id,
      analysis: insertSession.analysis ?? null,
      createdAt: new Date(),
    };
    this.vocalSessions.set(id, session);
    return session;
  }

  async getVocalSession(id: string): Promise<VocalSession | undefined> {
    return this.vocalSessions.get(id);
  }

  async getAllVocalSessions(): Promise<VocalSession[]> {
    return Array.from(this.vocalSessions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateVocalSessionAnalysis(id: string, analysis: any): Promise<VocalSession | undefined> {
    const session = this.vocalSessions.get(id);
    if (!session) return undefined;
    
    const updated = { ...session, analysis };
    this.vocalSessions.set(id, updated);
    return updated;
  }

  async createProcessingChain(insertChain: InsertProcessingChain): Promise<ProcessingChain> {
    const id = randomUUID();
    const chain: ProcessingChain = {
      ...insertChain,
      id,
      isActive: insertChain.isActive ?? false,
      createdAt: new Date(),
    };
    this.processingChains.set(id, chain);
    return chain;
  }

  async getProcessingChainsBySession(sessionId: string): Promise<ProcessingChain[]> {
    return Array.from(this.processingChains.values())
      .filter(chain => chain.sessionId === sessionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getActiveChain(sessionId: string): Promise<ProcessingChain | undefined> {
    return Array.from(this.processingChains.values())
      .find(chain => chain.sessionId === sessionId && chain.isActive);
  }

  async updateChainActiveStatus(chainId: string, isActive: boolean): Promise<ProcessingChain | undefined> {
    const chain = this.processingChains.get(chainId);
    if (!chain) return undefined;

    if (isActive) {
      Array.from(this.processingChains.values())
        .filter(c => c.sessionId === chain.sessionId && c.id !== chainId)
        .forEach(c => {
          this.processingChains.set(c.id, { ...c, isActive: false });
        });
    }

    const updated = { ...chain, isActive };
    this.processingChains.set(chainId, updated);
    return updated;
  }

  async createEffect(insertEffect: InsertEffect): Promise<Effect> {
    const id = randomUUID();
    const effect: Effect = {
      ...insertEffect,
      id,
      bypassed: insertEffect.bypassed ?? false,
    };
    this.effects.set(id, effect);
    return effect;
  }

  async getEffectsByChain(chainId: string): Promise<Effect[]> {
    return Array.from(this.effects.values())
      .filter(effect => effect.chainId === chainId)
      .sort((a, b) => a.order - b.order);
  }

  async updateEffect(id: string, updates: Partial<InsertEffect>): Promise<Effect | undefined> {
    const effect = this.effects.get(id);
    if (!effect) return undefined;

    const updated = { ...effect, ...updates };
    this.effects.set(id, updated);
    return updated;
  }

  async deleteEffect(id: string): Promise<boolean> {
    return this.effects.delete(id);
  }

  async createSnapshot(insertSnapshot: InsertSnapshot): Promise<Snapshot> {
    const id = randomUUID();
    const snapshot: Snapshot = {
      ...insertSnapshot,
      id,
      createdAt: new Date(),
    };
    this.snapshots.set(id, snapshot);
    return snapshot;
  }

  async getSnapshotsBySession(sessionId: string): Promise<Snapshot[]> {
    return Array.from(this.snapshots.values())
      .filter(snapshot => snapshot.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      model: insertMessage.model ?? null,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const storage = new MemStorage();
