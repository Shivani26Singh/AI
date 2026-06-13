import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const jiraBaseUrl = env.VITE_JIRA_BASE_URL || 'https://your-domain.atlassian.net'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/jira': {
          target: jiraBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/jira/, '/rest/api/2'),
          secure: true,
        },
        '/api/groq': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/groq/, '/openai/v1'),
          secure: true,
        },
      },
    },
  }
})
