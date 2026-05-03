import { z } from 'zod'


const ColumnScehma = z.object({
  name: z.string().describe(`Name of the column`),
  type: z.enum(['string', 'number', 'date']).describe(`Data type of column`),
  nullable: z.boolean().describe(`Allowing null`)
});


const ColumnsScehma = z.object({
  schema_columns: z.array(ColumnScehma).describe(`List of columns`),
});


export default ColumnsScehma;