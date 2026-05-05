import { StateGraph, START, END, StateSchema } from '@langchain/langgraph';
import { nullable, z } from 'zod';
import inspect_node from './inspect.node';
import schema_node from './schema.node';
import validation_node from './validate.node';

const AppState = new StateSchema({
  filePath: z.string().describe(`File path for the csv file to be read`),
  csv_sample: z.object({
    headers: z.array(z.string()).describe(`Headers of csv`),
    samples: z.array(z.any()).describe(`Sample data of csv`),
  }).describe(`Header and sample data of csv`),
  schema_columns: z.object({
    name: z.string(),
    type: z.enum(['string', 'number', 'date']),
    nullable: z.boolean(),
  }),
  issues: z.array(
    z.object({
      column: z.string().describe(`The name of the column in the CSV where the issue is found.`),
      issue: z.string().describe(`A clear description of the data quality problem detected in this column`),
      severity: z.enum(['low', 'medium', 'high']).describe(`Severity level of the issue: low (minor), medium (affects usability), high (break the process or causes of errors)`)
    }),
  ),
});

export type State = typeof AppState.State;

const builder = new StateGraph(AppState);

builder
  .addNode('inspect', inspect_node)
  .addNode('schema', schema_node)
  .addNode('validate', validation_node)
  .addEdge(START, 'inspect')
  .addEdge('inspect', 'schema')
  .addEdge('schema', 'validate')
  .addEdge('validate', END);

const Graph = builder.compile();

export default Graph;