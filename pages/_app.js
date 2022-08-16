import '../styles/globals.css'
import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
      }}
    >
      <NotificationsProvider>
        <Component {...pageProps} />
      </NotificationsProvider>
    </MantineProvider>
  )
}

export default MyApp
