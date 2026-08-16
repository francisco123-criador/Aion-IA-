import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Configuração do Capacitor para gerar o APK Android da Aion.
 *
 * IMPORTANTE:
 * A Aion usa uma API de chat no servidor (/api/chat), então o APK NÃO deve
 * embutir arquivos estáticos (o chat não funcionaria sem o backend).
 * Por isso o APK carrega a versão web publicada, definida na URL abaixo.
 *
 * Passo final: troque a URL abaixo pelo endereço público onde a Aion estiver
 * publicada (ex.: https://aion.example.com) e rode:
 *   npx cap add android && npx cap sync
 */
const config: CapacitorConfig = {
  appId: 'br.com.aion.app',
  appName: 'Aion',
  webDir: 'dist',
  server: {
    // Defina o endereço público da Aion para o APK carregá-lo.
    url: process.env.AION_PUBLIC_URL ?? 'https://SEU-DOMINIO-DA-AION.com',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
}

export default config
