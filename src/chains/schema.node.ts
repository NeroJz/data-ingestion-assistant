import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import ColumnsScehma from '../schemas/columns.schema';
import { State } from './graph';

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini'
}).withStructuredOutput(ColumnsScehma);


const system_prompt = `
You are a data engineer. Extract a schema from CSV samples.
Return ONLY valid JSON.
No explanation.
`;

const user_prompt = `
CSV sample:
{samples}
`;

let infer_prompt_template = ChatPromptTemplate
  .fromMessages([
    ['system', system_prompt],
    ['human', user_prompt]
  ]);


const schema_node = async (state: State) => {
  const messages = await infer_prompt_template
    .formatMessages({
      samples: JSON.stringify(state.csv_sample.samples)
    });

  const result = await llm.invoke(messages);

  return {
    ...result
  };
};

export default schema_node;