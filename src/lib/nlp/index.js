import { dockStart } from "@nlpjs/basic";

export default async function nlp(corpus, prompt) {
  const dock = await dockStart({ use: ["Basic"] });
  const nlp = dock.get("nlp");
  // await nlp.addCorpus(training_data[corpus]);
  await nlp.addCorpus(corpusData[corpus]);
  await nlp.train();
  const response = await nlp.process("en", prompt);
  return response;
}

const corpusData = {
  issueName: {
    name: "issueNameCorpus",
    locale: "en-US",
    data: [
      {
        intent: "caseName.valid",
        utterances: [
          "R v. John Doe & Another",
          "Makau v. Republic",
          "Case of Omondi and Others v. Attorney General",
          "In the Matter of Constitutional Petition No. 123 of 2022",
          "Wambua & Sons Ltd v. Kenya Revenue Authority",
          "High Court Civil Case No. 4567 of 2021: Kenya Bankers Association v. Central Bank of Kenya",
          "Mukami and Another v. Director of Public Prosecutions",
          "Application for Judicial Review No. 789 of 2023: In Environmental Impact Assessment",
        ],
        answers: ["valid"],
      },
      {
        intent: "caseName.invalid",
        utterances: [
          "Hi",
          "fdffffgdfg",
          "%%ghdf%%jn %^&%^&",
          "435435fgh4((( ",
          "86654&&876567 ()879jkhkj",
          "Hello",
          "I am a Kenyan",
          "come again",
        ],
        answers: ["invalid"],
      },
    ],
  },
};

const corpus_del = {
  name: "LegalCorpus",
  locale: "en-GB",
  data: [
    {
      intent: "caseName.valid",
      utterances: [
        "initialize issue: R v. John Doe & Another",
        "initialize issue: Makau v. Republic",
        "initialize issue: Case of Omondi and Others v. Attorney General",
        "initialize issue: In the Matter of Constitutional Petition No. 123 of 2022",
        "initialize issue: Wambua & Sons Ltd v. Kenya Revenue Authority",
        "initialize issue: High Court Civil Case No. 4567 of 2021: Kenya Bankers Association v. Central Bank of Kenya",
        "initialize issue: Mukami and Another v. Director of Public Prosecutions",
        "initialize issue: Application for Judicial Review No. 789 of 2023: In Environmental Impact Assessment",
      ],
      answers: ["valid issue name"],
    },
    {
      intent: "caseName.invalid",
      utterances: [
        "initialize issue: 12345",
        "initialize issue: fffffffgdfg",
        "initialize issue: %%ghdf%%jn %^&%^&",
        "initialize issue: 435435fgh4((( ",
        "initialize issue: 86654&&876567 ()879jkhkj",
        "initialize issue: Hello",
        "initialize issue: I dont understand you",
        "initialize issue: come again",
      ],
      answers: ["invalid issue name"],
    },
    {
      intent: "legal.definitions",
      utterances: [
        "Define {term}",
        "What is the meaning of {term}",
        "Explain {term}",
        "Give me the definition of {term}",
      ],
      answers: [
        "The term {term} refers to...",
        "In legal terms, {term} means...",
        "The definition of {term} is...",
      ],
    },
    {
      intent: "legal.advice",
      utterances: [
        "I need legal advice",
        "Can you provide legal guidance on {issue}",
        "What should I do in case of {situation}",
        "Advice on {legal matter}",
      ],
      answers: [
        "I am not a lawyer, and this is not legal advice. It's recommended to consult with a professional for your specific situation.",
        "Legal advice should be obtained from a qualified attorney. Consult with a legal professional for accurate information.",
      ],
    },
    {
      intent: "legal.rights",
      utterances: [
        "What are my legal rights in {situation}",
        "Tell me about my rights when {circumstance}",
        "Do I have any rights if {condition}",
      ],
      answers: [
        "In {situation}, your legal rights include...",
        "When {circumstance}, you have the right to...",
        "If {condition}, your rights may involve...",
      ],
    },
    {
      intent: "legal.documents",
      utterances: [
        "How to draft a {type of document}",
        "What should be included in a {legal document}",
        "Guidelines for creating a {type of contract}",
        "Tips for preparing {legal paperwork}",
      ],
      answers: [
        "When drafting a {type of document}, consider including...",
        "A well-prepared {legal document} typically includes...",
        "Guidelines for creating a {type of contract} may involve...",
      ],
    },
    {
      intent: "legal.process",
      utterances: [
        "Explain the legal process for {case type}",
        "How does {legal procedure} work",
        "Step-by-step guide for {legal process}",
        "What happens during {legal proceeding}",
      ],
      answers: [
        "The legal process for {case type} involves...",
        "In {legal procedure}, the steps include...",
        "A step-by-step guide for {legal process} is as follows...",
      ],
    },
    {
      intent: "legal.entities",
      utterances: [
        "What are the legal responsibilities of {entity}",
        "Legal obligations for {organization}",
        "Explain the duties of {legal entity}",
      ],
      answers: [
        "The legal responsibilities of {entity} include...",
        "For {organization}, legal obligations may involve...",
        "The duties of {legal entity} typically encompass...",
      ],
    },
    {
      intent: "legal.court",
      utterances: [
        "How does the court system work",
        "Explain the role of {type of court}",
        "Legal procedures in {court system}",
      ],
      answers: [
        "The court system operates by...",
        "In {type of court}, the role includes...",
        "Legal procedures in {court system} may consist of...",
      ],
    },
    {
      intent: "legal.settlement",
      utterances: [
        "What is a legal settlement",
        "How to negotiate a settlement",
        "Tell me about settling a {type of case}",
      ],
      answers: [
        "A legal settlement is an agreement where...",
        "Negotiating a settlement involves...",
        "In settling a {type of case}, considerations include...",
      ],
    },
    {
      intent: "legal.mediation",
      utterances: [
        "Explain the process of mediation",
        "How does legal mediation work",
        "Benefits of opting for mediation",
      ],
      answers: [
        "Mediation is a process where...",
        "Legal mediation works by...",
        "Benefits of opting for mediation include...",
      ],
    },
    {
      intent: "legal.disclaimer",
      utterances: [
        "Disclaimer about legal advice",
        "This is not legal advice",
        "Consult a lawyer for accurate information",
      ],
      answers: [
        "I am not a lawyer, and the information provided is not legal advice.",
        "This is a general information platform. Consult with a qualified attorney for legal advice.",
      ],
    },
    {
      intent: "None",
      utterances: [
        "I need advice",
        "Can you help me",
        "Tell me more",
        "What should I do",
      ],
      answers: ["Sorry, I don't understand"],
    },
  ],
};
