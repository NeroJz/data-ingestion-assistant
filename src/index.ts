import path from 'node:path';
import { csvToJson } from './utils';
import infer_schema_node from './chains/infer.chain';


async function run() {

  let filePath = path.join(process.cwd(), 'data', 'salaries_2023.csv');

  const {
    headers,
    samples,
  }: { headers: any, samples: any[] } = await csvToJson(filePath, 10);

  const result = await infer_schema_node({ samples: samples });

  console.log(result.schema);
}


run();