import '../styles/globals.css'
import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { SessionProvider as AuthProvider } from 'next-auth/react';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));
  
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider session={pageProps.session}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme: 'dark',
              fontFamily: 'Roboto,sans-serif',
            }}
          >
            <NotificationsProvider>
              <Component {...pageProps} />
              {/* <ReactQueryDevtools initialIsOpen={false}/> */}
            </NotificationsProvider>
          </MantineProvider>
        </AuthProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default MyApp
