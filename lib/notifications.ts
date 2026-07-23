import prisma from "@/lib/prisma";

export async function createNotification(title: string, message: string, type = "info", link?: string) {
  try {
    await (prisma as any).notification.create({
      data: { title, message, type, link: link || null }
    });
  } catch {}
}
