
import { ChatOpenAI } from '@langchain/openai';
import path from 'node:path';
import { csvToJson } from './utils';


async function run() {
  // const model = new ChatOpenAI({
  //   model: 'gpt-4o-mini'
  // });

  // const res = await model.invoke(`Explain CSV schema inference in 3 lines`);

  // console.log(res.content);

  let filePath = path.join(process.cwd(), 'data', 'salaries_2023.csv');

  const {
    headers,
    first,
    last
  }: { headers: any, first: any, last: any } = await csvToJson(filePath, 10);

  console.log(headers);
  console.log(first);
  console.log(last);
}


run();