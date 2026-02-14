import { prisma } from '@/lib/prisma';
import type { CorrectiveAction, KnowledgeBankEntry, ReworkEntry } from '@prisma/client';

export async function getReworkEntries(): Promise<ReworkEntry[]> {
  try {
    return await prisma.reworkEntry.findMany({ orderBy: { date: 'desc' } });
  } catch {
    return [];
  }
}

export async function getCorrectiveActions(): Promise<CorrectiveAction[]> {
  try {
    return await prisma.correctiveAction.findMany({ orderBy: { targetDate: 'asc' } });
  } catch {
    return [];
  }
}

export async function getKnowledgeEntries(filters?: {
  station?: string;
  defectType?: string;
}): Promise<KnowledgeBankEntry[]> {
  try {
    return await prisma.knowledgeBankEntry.findMany({
      where: {
        station: filters?.station as never,
        defectType: filters?.defectType ? { contains: filters.defectType } : undefined
      },
      orderBy: { dateClosed: 'desc' }
    });
  } catch {
    return [];
  }
}
