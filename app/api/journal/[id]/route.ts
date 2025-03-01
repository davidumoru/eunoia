import { analyze } from "@/utils/ai";
import { getUserFromClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request) => {
  const { content } = await request.json();
  const user = await getUserFromClerkID();
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Invalid journal ID" }, { status: 400 });
  }

  const updatedEntry = await prisma.journalEntry.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      content,
    },
  });

  const analysis = await analyze(updatedEntry.content);
  await prisma.analysis.upsert({
    where: {
      entryId: updatedEntry.id,
    },
    create: {
      entryId: updatedEntry.id,
      ...analysis,
    },
    update: analysis,
  });

  return NextResponse.json({ data: updatedEntry });
};
