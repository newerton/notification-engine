import { z } from 'zod/v3';

export interface CreateValidationSchema {
  createSchema(): z.Schema;
}
