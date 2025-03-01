import Editor from "@/components/Editor";
import { getUserFromClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getEntry = async (id: string) => {
  const user = await getUserFromClerkID();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });
  return entry;
};

const EntryPage = async ({ params }: { params: { id: string } }) => {
  const entry = await getEntry(params.id);
  return (
    <div className="w-full h-full">
      {entry ? <Editor entry={entry} /> : <div>Entry not found</div>}
    </div>
  );
};

export default EntryPage;
