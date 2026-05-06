import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { State } from './graph';

const SqlSchema = z.object({
  create_table: z.string().describe(`DLL script for creating table`),
  insert_strategy: z.string().describe(`Strategy for inserting the data`),
});


const llm = new ChatOpenAI({
  model: 'gpt-4o-mini'
}).withStructuredOutput(SqlSchema);


const systemPrompt = `
Your are a senior data engineer. 

When validation issues exist:
- Avoid strict typing that may cause failure
- Use staging tables or safe casting
- Prefer robustness over strictness

Generate production-ready SQL server DDL.
`;

const userPrompt = `
Schema:
{schema}

Validation Issues:
{validation}

Generate:
1. CREATE TABLE statement
2. Insert strategy
`;

const sqlPrompt = ChatPromptTemplate.fromMessages([
  ['system', systemPrompt],
  ['human', userPrompt]
]);


const sql_node = async (state: State) => {
  const messages = await sqlPrompt
    .formatMessages({
      schema: JSON.stringify(state.schema_columns),
      validation: JSON.stringify(state.issues)
    });

  const result = await llm.invoke(messages);

  return {
    ...result
  };
};


export default sql_node;