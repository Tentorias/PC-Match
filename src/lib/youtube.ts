export interface VideoBenchmark {
  title: string;
  url: string;
  thumbnail: string;
  channelTitle?: string;
}

/**
 * Busca vídeos de benchmark no YouTube para uma combinação de CPU + GPU e um Jogo específico.
 */
export async function searchYoutubeBenchmarks(
  cpuModel: string,
  gpuModel: string,
  gameName: string
): Promise<VideoBenchmark[]> {
  const query = `${cpuModel} + ${gpuModel} ${gameName} benchmark`;
  console.log(`Buscando benchmarks no YouTube para: "${query}"`);

  // TODO: Implementar chamada à API do YouTube v3 caso o usuário configure a chave
  // GET https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&key={apiKey}&type=video

  // Por padrão, geramos um link direto para a busca do YouTube e retornamos resultados mockados funcionais.
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  return [
    {
      title: `${gameName} Benchmark | ${cpuModel} + ${gpuModel} - Teste de Desempenho`,
      url: searchUrl,
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&h=180&fit=crop",
      channelTitle: "Canal de Hardware Benchmark (Link Externo)",
    },
    {
      title: `Como roda? ${gameName} na ${gpuModel} + ${cpuModel}`,
      url: searchUrl,
      thumbnail: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?q=80&w=300&h=180&fit=crop",
      channelTitle: "Análises de PC (Link Externo)",
    }
  ];
}
