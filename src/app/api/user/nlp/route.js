import nlp from "@/lib/nlp";

export async function POST(request) {
  // request body
  const { corpus, prompt } = await request.json();
  console.log("POST REQUEST: nlp request: ", corpus, "-", prompt);
  try {
    const res = await nlp(corpus, prompt);
    console.log(" > SUCCESS: nlp success: ", res, "\n................");
    return Response.json({ success: res.answer });
  } catch (err) {
    console.log(" > ERROR: nlp error: ", err, "\n................");
    return Response.json({ error: err });
  }
}
