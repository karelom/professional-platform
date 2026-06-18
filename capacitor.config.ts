import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.yuflorist.hanawu',
  appName: '花窩',
  webDir: '.output/public',
  server: {
    androidScheme: 'https',
  },
}

export default config
