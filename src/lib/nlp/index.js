import { dockStart } from "@nlpjs/basic";

export async function nlp(request) {
  const dock = await dockStart({ use: ["Basic"] });
  const nlp = dock.get("nlp");
  await nlp.addCorpus("./corpus-en.json");
  await nlp.train();
  const response = await nlp.process("en", request);
  return response;
}
