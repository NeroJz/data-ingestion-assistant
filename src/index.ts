import path from 'node:path';
import Graph from './chains/graph';
import fs from 'node:fs/promises';


async function drawGraph() {
  const drawableGraph = await Graph.getGraphAsync();
  if (drawableGraph) {
    const image = await drawableGraph.drawMermaidPng();
    const imageBuffer = new Uint8Array(await image.arrayBuffer());
    await fs.writeFile('graph.png', imageBuffer);
  }
}

async function run() {
  let filePath = path.join(process.cwd(), 'data', 'salaries_2023.csv');

  const result = await Graph.invoke({
    filePath
  });

  console.log(result);
}


run();