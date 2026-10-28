export const posterUrl = "https://www.canva.com/design/DAGFgwo55X4/yyUm1nnZ6K4hQICGAQuEpA/view";
export const writtenWorkUrl = "/documents/trabajo-escrito-esis-2026.pdf";
export const model3dUrl =
  "https://cad.onshape.com/documents/0c5c20d0cb4fe0b0f404d95f/w/c912699734b63f7779787b22/e/823fa6a4b29591f73f15b21a?renderMode=0&uiState=6ad7f10fa941be13c577d46c";

// A deployed preview shares its own address; no legacy hosting URL is embedded.
export function platformUrl(origin: string) {
  const url = new URL(origin);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("La plataforma requiere una URL HTTP o HTTPS.");
  }
  return url.origin;
}
