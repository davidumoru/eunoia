import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

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
