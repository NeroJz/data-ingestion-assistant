
import { ChatOpenAI } from '@langchain/openai';


async function run() {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini'
  });

  const res = await model.invoke(`Explain CSV schema inference in 3 lines`);

  console.log(res.content);
}


run();