import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router'
import { getApiKey, subscribeApiKey } from '../shared/api/api-key'
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

export function App() {
  // Смена ключа меняет пользователя Keitaro: данные под старым ключом невалидны
  const [, setApiKeyVersion] = useState(getApiKey())

  useEffect(
    () =>
      subscribeApiKey((apiKey) => {
        queryClient.clear()
        setApiKeyVersion(apiKey)
      }),
    [],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
