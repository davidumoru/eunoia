import { z } from "zod";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "langchain/document";
import { loadQARefineChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe("the mood of the person who wrote the journal entry."),
    subject: z
      .string()
      .describe(
        "the subject of the journal entry (i.e. what the journal entry is about)."
      ),
    summary: z
      .string()
      .describe("a quick summary of the entire journal entry."),
    negative: z
      .boolean()
      .describe(
        "is the journal entry negative? (i.e. does it have negative connotations or emotions?)."
      ),
    color: z
      .string()
      .describe(
        "a hexadecimal color code that represents the mood of the person who wrote the journal entry (Example: #0101fe for blue representing happiness)."
      ),
  })
);

const getPrompt = async (content) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template: `
    Analyze the following journal entry. Follow the intructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}
    `,
    inputVariables: ["entry"],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyze = async (content) => {
  const input = await getPrompt(content);
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const response = await model.call([{ role: "system", content: input }]);
  const result = response.content || "";

  try {
    return parser.parse(result);
  } catch (error) {
    console.error("Error in analyze function:", error);
  }
};

export const qa = async (question, entries) => {
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: {
        id: entry.id,
        createdAt: entry.createdAt,
      },
    });
  });

  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  const chain = loadQARefineChain(model);
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await vectorStore.similaritySearch(question);
  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  });

  return res.output_text;
};
