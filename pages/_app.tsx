import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { AuthContextProvider } from '../hooks/AuthContext'
import '@fontsource/raleway/500.css'
import '@fontsource/open-sans/700.css'
import '@fontsource/aileron/700.css'

// const colors = {
//   brand: {
//     900: '#1a365d',
//     800: '#153e75',
//     700: '#2a69ac',
//   },
// }

// const theme = extendTheme({ colors })

const theme = extendTheme({
  semanticTokens: {
    colors: {
      error: 'red.500',
      success: 'green.500',
      primary: {
        default: 'red.500',
        _dark: 'red.400',
      },
      secondary: {
        default: 'red.800',
        _dark: 'red.700',
      },
    },
  },
  fonts: {
    heading: 'Aileron, sans-serif',
    body: 'Raleway, sans-serif',
  },
  shadows: {
    purple: '0px 0px 25px rgba(159, 122, 234, 0.6)',
    white_btn: '0px 0px 5px white',
    multicolor: '1px 1px 15px purple, 0 0 50px darkblue, 0 0 15px blue',

  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </ChakraProvider>
    
  )
}

export default MyApp
