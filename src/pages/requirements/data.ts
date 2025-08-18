import type { Transaction } from ".";

const transactions: Transaction[] = [
  // TIN APPLICATION
  {
    id: "",
    name: "Approval of Application for Taxpayer Identification Number (TIN) of Local Employee - Online thru ORUS",
    duration: "3 Days",
    fee: "No Processing Fee",
    service: "REGISTRATION",
    category: "TIN Application",
    requirements: [
      {
        id: "",
        name: "Any government-issued ID, in case the ID has no address, any proof of residence or business address. (1 scanned copy)",
        note: "IDs should be readable, unaltered and contains consistent information with the application. Along with the scanned ID, upload a selfie photo of yourself holding the same ID.",
        conditions: ["Local Employee"],
      },
      {
        id: "",
        name: "Marriage contract. (1 scanned copy)",
        conditions: ["Local Employee", "Married Female"],
      },
      {
        id: "",
        name: "Passport (Bio page, including date of entry/arrival and exit/departure stamp, if applicable). (1 scanned copy)",
        conditions: ["Foreign National/Alien Employee"],
      },
      {
        id: "",
        name: "Employment contract or equivalent document indicating duration of employment, compensation and other benefits, and scope of duties. (1 scanned certified true copy)",
        conditions: [
          "Foreign National/Alien Employee",
          "International Gaming Licensee (IGL) or POGO Employee",
        ],
      },
    ],
  },
  {
    id: "",
    name: "Application for Taxpayer Identification Number (TIN) of Local Employee - Manual Processing (Walk-in)",
    duration: "6 Hours",
    fee: "No Processing Fee",
    service: "REGISTRATION",
    category: "TIN Application",
    requirements: [
      {
        id: "",
        name: "BIR Form No. 1902. (2 originals)",
        conditions: ["Local Employee"],
      },
      {
        id: "",
        name: "Any government-issued ID, in case the ID has no address, any proof of residence or business address. (1 scanned copy)",
        conditions: ["Local Employee"],
      },
      {
        id: "",
        name: "Special Power of Attorney (SPA) executed by the taxpayer-applicant indicating the purpose and name of authorized representative. (1 original)",
        conditions: ["Local Employee", "Transacting through a Representative"],
      },
      {
        id: "",
        name: "Any government-issued ID of the taxpayer and authorized representative. (1 photocopy, both with one specimen signature)",
        conditions: ["Local Employee", "Transacting through a Representative"],
      },
      {
        id: "",
        name: "Marriage contract. (1 scanned copy)",
        conditions: ["Local Employee", "Married Female"],
      },
      {
        id: "",
        name: "BIR Form No. 1902. (2 originals)",
        conditions: ["Foreign National/Alien Employee"],
      },
      {
        id: "",
        name: "Passport (Bio page, including date of entry/arrival and exit/departure stamp, if applicable); (1 photocopy)",
        conditions: ["Foreign National/Alien Employee"],
      },
      {
        id: "",
        name: "Employment contract or equivalent document indicating the duration of employment, compensation and other benefits, and scope of duties. (1 certified true copy)",
        conditions: [
          "Foreign National/Alien Employee",
          "International Gaming Licensee (IGL) or POGO Employee",
        ],
      },
      {
        id: "",
        name: "Employment contract or equivalent document indicating the duration of employment, compensation and other benefits, and scope of duties. (1 certified true copy)",
        conditions: [
          "Manually securing TIN on behalf of its employees due to system unavailability",
        ],
      },
      {
        id: "",
        name: "Employment contract or equivalent document indicating the duration of employment, compensation and other benefits, and scope of duties. (1 certified true copy)",
        conditions: [
          "Manually securing TIN on behalf of its employees due to system unavailability",
        ],
      },
      {
        id: "",
        name: "Employment contract or equivalent document indicating the duration of employment, compensation and other benefits, and scope of duties. (1 certified true copy)",
        conditions: [
          "Manually securing TIN on behalf of its employees due to system unavailability",
        ],
      },
      {
        id: "",
        name: "Employment contract or equivalent document indicating the duration of employment, compensation and other benefits, and scope of duties. (1 certified true copy)",
        conditions: [
          "Manually securing TIN on behalf of its employees due to system unavailability",
        ],
      },
      {
        id: "",
        name: "Employment contract or equivalent document indicating the duration of employment, compensation and other benefits, and scope of duties. (1 certified true copy)",
        conditions: [
          "Manually securing TIN on behalf of its employees due to system unavailability",
        ],
      },
    ],
  },
  {
    id: "",
    name: "Application for Taxpayer Identification Number (TIN) of Local Employee [Bulk Transactions consisting of six (6) applications and above] - Manual Processing (Walk-in)",
    duration: "3 Days",
    fee: "No Processing Fee",
    service: "REGISTRATION",
    category: "TIN Application",
    requirements: [],
  },
  {
    id: "",
    name: "Application for Taxpayer Identification Number (TIN) [Executive Order (E.O) No. 98/One-Time Transaction (ONETT) Taxpayer] - Manual Processing (Walk-in)",
    duration: "6 Hours",
    fee: "No Processing Fee",
    service: "REGISTRATION",
    category: "TIN Application",
    requirements: [],
  },
  {
    id: "",
    name: "Application for Taxpayer Identification Number (TIN) [Executive Order (E.O) No. 98/One-Time Transaction (ONETT) Taxpayer] - Online thru ORUS",
    duration: "3 Days",
    fee: "No Processing Fee",
    service: "REGISTRATION",
    category: "TIN Application",
    requirements: [],
  },
];

export default transactions;
