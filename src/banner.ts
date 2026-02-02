/**
 * Banner estilo fastfetch: ASCII "easyfour" + van 4x4
 * Exibido no start do servidor. ASCII puro para qualquer terminal.
 */

// Usar \\ para cada \ no ASCII; evitar \\ no fim da linha (escaparia a quebra).
const BANNER = `
▄▄▄▄▄  ▄▄▄   ▄▄▄▄ ▄▄ ▄▄ ▄▄▄▄▄  ▄▄▄  ▄▄ ▄▄ ▄▄▄▄     ▄▄▄   ▄▄▄▄  ▄▄▄▄ ▄▄  ▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄  ▄▄  ▄▄ ▄▄▄▄▄▄ 
██▄▄  ██▀██ ███▄▄ ▀███▀ ██▄▄  ██▀██ ██ ██ ██▄█▄   ██▀██ ███▄▄ ███▄▄ ██ ███▄▄   ██  ██▀██ ███▄██   ██   
██▄▄▄ ██▀██ ▄▄██▀   █   ██    ▀███▀ ▀███▀ ██ ██   ██▀██ ▄▄██▀ ▄▄██▀ ██ ▄▄██▀   ██  ██▀██ ██ ▀██   ██                                                                                                                             
`;

export function printBanner(): void {
  // Normalizar CRLF -> LF para não sobrescrever linhas no Windows
  console.log(BANNER.replace(/\r\n/g, '\n').replace(/\r/g, '\n'));
}
