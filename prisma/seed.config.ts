import { defineConfig } from 'prisma'

export default defineConfig({
  seed: {
    script: 'tsx prisma/seed.ts',
  },
})

