import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { State } from './graph';

/*
const QueryScehma = z.object({
  query: z.string().describe(`Query being generated.`)
});
*/

const ValidateSchema = z.object({
  issues: z.array(
    z.object({
      column: z.string().describe(`The name of the column in the CSV where the issue is found.`),
      issue: z.string().describe(`A clear description of the data quality problem detected in this column`),
      severity: z.enum(['low', 'medium', 'high']).describe(`Severity level of the issue: low (minor), medium (affects usability), high (break the process or causes of errors)`)
    })
  ).describe(`List of data quality issues found when validating the CSV sample against the inferred schema`)
});

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini'
}).withStructuredOutput(ValidateSchema);

const system_prompt = `
You are a data quality engineer.
Analyze CSV sample against schema.
Return structured validation issues only.
`;

const user_prompt = `
Schema:
{schema_columns}

CSV sample:
{samples}
`;

const ValidationPrompt = ChatPromptTemplate
  .fromMessages([
    ['system', system_prompt],
    ['user', user_prompt]
  ]);

const validation_node = async (state: State) => {
  const messages = await ValidationPrompt
    .format({
      samples: JSON.stringify(state.csv_sample.samples),
      schema_columns: JSON.stringify(state.schema_columns)
    });

  const result = await llm.invoke(messages);

  return {
    ...result
  };
}

export default validation_node;