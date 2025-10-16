import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { exampleMiddlewareWithContext } from '@/core/middleware/example-middleware';

const baseFunction = createServerFn().middleware([
  exampleMiddlewareWithContext,
]);

const ExampleInputSchema = z.object({
  exampleKey: z.string().min(1),
});

type ExampleInput = z.infer<typeof ExampleInputSchema>;

export const examplefunction = baseFunction
  .inputValidator((data: ExampleInput) => ExampleInputSchema.parse(data))
  .handler(async (_ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return 'Function executed successfully';
  });
