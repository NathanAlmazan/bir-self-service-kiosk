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
        name: "Passport (Bio page, including date of entry/arrival and exit/departure stamp, if applicable). (1 photocopy)",
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
    requirements: [
      {
        id: "",
        name: "BIR Form No. 1902. (2 originals)",
        conditions: ["Local Employee"],
      },
      {
        id: "",
        name: "Any government-issued ID (e.g. PhilID/ePhilID, Passport, Driver's License/eDriver's License,) that shows the name, address, and birthdate of the applicant, in case the ID has no address, any proof of residence or business address. (1 photocopy)",
        conditions: ["Local Employee"],
      },
      {
        id: "",
        name: "Marriage contract. (1 photocopy)",
        conditions: ["Local Employee", "Married Female"],
      },
      {
        id: "",
        name: "BIR Form No. 1902. (2 originals)",
        conditions: ["Foreign National/Alien Employee"],
      },
      {
        id: "",
        name: "Passport (Bio page, including date of entry/arrival and exit/departure stamp, if applicable). (1 photocopy)",
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
    name: "Application for Taxpayer Identification Number (TIN) [Executive Order (E.O) No. 98/One-Time Transaction (ONETT) Taxpayer] - Manual Processing (Walk-in)",
    duration: "6 Hours",
    fee: "No Processing Fee",
    service: "REGISTRATION",
    category: "TIN Application",
    requirements: [
      {
        id: "",
        name: "BIR Form No. 1904. (2 originals)",
        conditions: ["E.O. 98 and ONETT Individual: Local and Resident Alien"],
      },
      {
        id: "",
        name: "Any government-issued ID (e.g. PhilID/ePhilID, Passport, Drive's License/eDrive's License,) that shows the name, address, and birthdate of the applicant, in case the ID has no address, any proof of residence or business address. (1 photocopy)",
        group: "Local Identification",
        conditions: ["E.O. 98 and ONETT Individual: Local and Resident Alien"],
      },
      {
        id: "",
        name: "Death Certificate of decedent or Extrajudicial Settlement of the Estate/Affidavit of Self Adjudication for transfer of property by succession. (1 photocopy)",
        group: "Local Identification",
        conditions: [
          "E.O. 98 and ONETT Individual: Local and Resident Alien",
          "Transfer of Properties by Succession",
        ],
      },
      {
        id: "",
        name: "Marriage contract. (1 photocopy)",
        conditions: [
          "E.O. 98 and ONETT Individual: Local and Resident Alien",
          "Married Female",
        ],
      },
      {
        id: "",
        name: "Barangay Certification that the applicant is a resident of the barangay and is a First Time Job Seeker. (1 certified true copy)",
        conditions: [
          "E.O. 98 and ONETT Individual: Local and Resident Alien",
          "First Time Job Seeker",
        ],
      },
      {
        id: "",
        name: "Special Power of Attorney (SPA) executed by the taxpayer-applicant indicating the purpose and name of authorized representative; (1 original)",
        conditions: [
          "E.O. 98 and ONETT Individual: Local and Resident Alien",
          "Transacting through a Representative",
        ],
      },
      {
        id: "",
        name: "Any government-issued ID of the taxpayer and authorized representative. (1 photocopy, both with one specimen signature)",
        conditions: [
          "E.O. 98 and ONETT Individual: Local and Resident Alien",
          "Transacting through a Representative",
        ],
      },
      {
        id: "",
        name: "BIR Form No. 1904. (2 originals)",
        conditions: ["E.O. 98 Foreign National (Non-Resident)"],
      },
      {
        id: "",
        name: "Passport (Bio page, including date of entry/arrival and exit/departure stamp, if applicable). (1 photocopy)",
        conditions: ["E.O. 98 Foreign National (Non-Resident)"],
      },
      {
        id: "",
        name: "Apostilled Special Power of Attorney (SPA) or authenticated by the Philippine Embassy or Consulate General, indicating the purpose and name of authorized representative. (1 certified true copy, original for presentation))",
        conditions: [
          "E.O. 98 Foreign National (Non-Resident)",
          "Transacting through a Representative",
        ],
      },
      {
        id: "",
        name: "Any government-issued ID of the taxpayer and authorized representative. (1 photocopy)",
        conditions: [
          "E.O. 98 Foreign National (Non-Resident)",
          "Transacting through a Representative",
        ],
      },
      {
        id: "",
        name: "Employment contract or equivalent document indicating the duration of employment, compensation and other benefits, and scope of duties if International Gaming Licensee (IGL) or POGO Employees. (1 certified true copy)",
        conditions: [
          "E.O. 98 Foreign National (Non-Resident)",
          "International Gaming Licensee (IGL) or POGO Employee",
        ],
      },
    ],
  },
  {
    id: "",
    name: "Application for Taxpayer Identification Number (TIN) [Executive Order (E.O) No. 98/One-Time Transaction (ONETT) Taxpayer] - Online thru ORUS",
    duration: "3 Days",
    fee: "No Processing Fee",
    service: "REGISTRATION",
    category: "TIN Application",
    requirements: [
      {
        id: "",
        name: "Any government-issued ID (e.g. PhilID/ePhilID, Passport, Drive's License/eDrive's License,) that shows the name, address, and birthdate of the applicant, in case the ID has no address, any proof of residence or business address. (1 photocopy)",
        note: "IDs should be readable, untampered and contains consistent information with the application. Along with the scanned ID, upload a selfie photo of yourself holding the same ID.",
        group: "Local Identification",
        conditions: ["E.O. 98 and ONETT Individual: Local and Resident Alien"],
      },
      {
        id: "",
        name: "Death Certificate of decedent or Extrajudicial Settlement of the Estate/Affidavit of Self Adjudication for transfer of property by succession. (1 photocopy)",
        group: "Local Identification",
        conditions: [
          "E.O. 98 and ONETT Individual: Local and Resident Alien",
          "Transfer of Properties by Succession",
        ],
      },
      {
        id: "",
        name: "Marriage contract. (1 photocopy)",
        conditions: [
          "E.O. 98 and ONETT Individual: Local and Resident Alien",
          "Married Female",
        ],
      },
      {
        id: "",
        name: "Barangay Certification that the applicant is a resident of the barangay and is a First Time Job Seeker. (1 certified true copy)",
        conditions: [
          "E.O. 98 and ONETT Individual: Local and Resident Alien",
          "First Time Job Seeker",
        ],
      },
      {
        id: "",
        name: "Special Power of Attorney (SPA) executed by the taxpayer-applicant indicating the purpose and name of authorized representative; (1 original)",
        conditions: [
          "E.O. 98 and ONETT Individual: Local and Resident Alien",
          "Transacting through a Representative",
        ],
      },
      {
        id: "",
        name: "Any government-issued ID of the taxpayer and authorized representative. (1 photocopy, both with one specimen signature)",
        conditions: [
          "E.O. 98 and ONETT Individual: Local and Resident Alien",
          "Transacting through a Representative",
        ],
      },
      {
        id: "",
        name: "Passport (Bio page, including date of entry/arrival and exit/departure stamp, if applicable). (1 photocopy)",
        conditions: ["E.O. 98 Foreign National (Non-Resident)"],
      },
      {
        id: "",
        name: "Apostilled Special Power of Attorney (SPA) or authenticated by the Philippine Embassy or Consulate General, indicating the purpose and name of authorized representative. (1 certified true copy, original for presentation))",
        conditions: [
          "E.O. 98 Foreign National (Non-Resident)",
          "Transacting through a Representative",
        ],
      },
      {
        id: "",
        name: "Any government-issued ID of the taxpayer and authorized representative. (1 photocopy)",
        conditions: [
          "E.O. 98 Foreign National (Non-Resident)",
          "Transacting through a Representative",
        ],
      },
      {
        id: "",
        name: "Employment contract or equivalent document indicating the duration of employment, compensation and other benefits, and scope of duties if International Gaming Licensee (IGL) or POGO Employees. (1 certified true copy)",
        conditions: [
          "E.O. 98 Foreign National (Non-Resident)",
          "International Gaming Licensee (IGL) or POGO Employee",
        ],
      },
    ],
  },
  // BUSINESS REGISTRATION
  {
    id: "",
    name: "Online Application for Registration of Nonresident Foreign Corporation (in General)",
    duration: "3 Days",
    fee: "No Processing Fee",
    service: "REGISTRATION",
    category: "Business / Branch Registration",
    requirements: [
      {
        id: "",
        name: "Any Apostille official documentation issued by an authorized government body (e.g. government agency (tax authority) thereof, or a municipality) that includes the name of the non-individual and the address of its principal office in the jurisdiction in which the non-individual was incorporated or organized (e.g. Articles of Incorporation, Certificate of Tax Residency). (1 scanned copy)",
        conditions: ["DEFAULT"],
      },
      {
        id: "",
        name: "Apostille Board Resolution or Secretary's Certificate (or equivalent) indicating purpose, explicitly stating the purpose of TIN application and nature or line business activity, and the name and details (TIN, email, contact no.) of the authorized representative. (1 scanned original)",
        conditions: ["DEFAULT", "Transacting through a Representative"],
      },
      {
        id: "",
        name: "Any government-issued ID of one of the signatory and authorized representatives. (1 scanned copy)",
        note: "Selfie photo of the authorized representative holding the ID shall be uploaded.",
        conditions: ["DEFAULT", "Transacting through a Representative"],
      },
    ],
  },
  // System & Permit Registration
  {
    id: "",
    name: "Application of Authority to Print (ATP) Invoices",
    duration: "1 Day",
    fee: "No Processing Fee",
    service: "REGISTRATION",
    category: "System & Permit Registration",
    requirements: [
      {
        id: "",
        name: "BIR Form No. 1906. (2 originals)",
        note: "Taxpayer-applicant should choose an Accredited Printer of Invoices.",
        conditions: ["Manual Bound Invoices"],
      },
      {
        id: "",
        name: "Final clear sample of OWN Invoices/Supplementary Invoices. (1 original)",
        conditions: ["Manual Bound Invoices"],
      },
      {
        id: "",
        name: "Last issued ATP (1 photocopy) or Printer Certificate of Delivery (PCD) (1 photocopy); or Any booklet from the last issued ATP for subsequent application. (Booklet need to be presented)",
        conditions: ["Manual Bound Invoices"],
      },
      {
        id: "",
        name: "BIR Form No. 1906. (2 originals)",
        note: "Taxpayer-applicant should choose an Accredited Printer of Invoices.",
        conditions: ["Loose Leaf-Invoices"],
      },
      {
        id: "",
        name: "Permit to Use Loose Leaf Invoices. (1 photocopy)",
        conditions: ["Loose Leaf-Invoices"],
      },
      {
        id: "",
        name: "Final clear sample of OWN Invoices/Supplementary Invoices. (1 original)",
        conditions: ["Loose Leaf-Invoices"],
      },
      {
        id: "",
        name: "Last issued ATP for subsequent application. (1 photocopy)",
        conditions: ["Loose Leaf-Invoices"],
      },
    ],
  },
  // Closure of Business / Cancellation of Registration
  {
    id: "",
    name: "Application of Authority to Print (ATP) Invoices",
    duration: "1 Day",
    fee: "No Processing Fee",
    service: "REGISTRATION",
    category: "Closure of Business / Cancellation of Registration",
    requirements: [
      {
        id: "",
        name: "BIR Form No. 1905. (2 original copies)",
        conditions: ["DEFAULT"],
      },
      {
        id: "",
        name: "List of ending inventory of goods, supplies, including capital good. (1 original copy)",
        conditions: ["DEFAULT"],
      },
      {
        id: "",
        name: "Inventory of unused invoices/supplementary invoices, together with Unused invoices/supplementary invoices and all other unutilized accounting forms (e.g. vouchers, debit/credit memos, delivery receipts, purchase orders, etc.) (1 original copy)",
        conditions: ["DEFAULT"],
      },
      {
        id: "",
        name: "Original copy of business Notices and Permits (e.g. ATP; NIRI; Accreditation Certificate and Permit to Use - for CRM/POS; etc.) issued to taxpayer as well as original copy of the Certificate of Registration (COR)",
        conditions: ["DEFAULT"],
      },
      {
        id: "",
        name: "Special Power of Attorney (SPA) executed by the taxpayer-applicant indicating specific transaction. [1 original for first time submission; if authorized to more than one transaction, submit Certified True Copy (together with the original copy for presentation and validation only)]",
        conditions: ["DEFAULT", "Transacting through a Representative"],
      },
      {
        id: "",
        name: "Any government-issued ID of the taxpayer and authorized representative. (1 photocopy, both with one specimen signature)",
        conditions: ["DEFAULT", "Transacting through a Representative"],
      },
    ],
  },
  // FILING & PAYMENT
  {
    id: "",
    name: "Processing and Issuance of Approved ONETT Computation Sheet (OCS) - For Onerous Transfer of Real Property - Both Taxable and Exempt - WALK-IN TAXPAYERS (ONETT transacted manually) - Simple",
    duration: "3 Days",
    fee: "No Processing Fee",
    service: "FILING & PAYMENT",
    category: "",
    requirements: [
      {
        id: "",
        name: "TIN of Seller/s and Buyer/s indicated in a duly accomplished TIN Verification Slip.",
        conditions: ["DEFAULT"],
      },
      {
        id: "",
        name: "Notarized Deed of Absolute Sale/ Deed of Transfer/Deed of Consolidation/ Deed of Assignment/ Sheriff's Certificate of Sale/Final Order of the Court Confirming the Sale/ Deed of Partition/Certificate of Award; [One (1) original copy and two (2) photocopies]",
        conditions: ["DEFAULT"],
      },
      {
        id: "",
        name: "Certified True Copy of the Tax Declaration of Real Property at the time or nearest to the date of the transaction issued by the Local Assessor's Office for land and improvement applicable to the taxable transaction; [One (1) original copy and one (1) photocopy]",
        conditions: ["DEFAULT"],
      },
      {
        id: "",
        name: "Certified True Copy of Original/ Transfer/ Condominium Certificate/s of Title (OCT/TCT/CCT); [One (1) original copy and one (1) photocopy]",
        conditions: ["DEFAULT"],
      },
      {
        id: "",
        name: "Copy of Government -Issued ID (with date of birth and photo) of the parties to the transaction and the authorized representative: [One (1) original copy and two (2) photocopies]",
        group: "Representative",
        conditions: [
          "DEFAULT",
          "Person Transacting or Signing is not one of the Parties to the Deed of Transfer",
        ],
      },
      {
        id: "",
        name: "Notarized Special Power of Attorney (SPA), if representing individual taxpayer/s.",
        group: "Representative",
        conditions: [
          "DEFAULT",
          "Person Transacting or Signing is not one of the Parties to the Deed of Transfer",
        ],
      },
      {
        id: "",
        name: "Secretary's Certificate or Board Resolution, if representing non-individual taxpayer/s.",
        group: "Representative",
        conditions: [
          "DEFAULT",
          "Person Transacting or Signing is not one of the Parties to the Deed of Transfer",
        ],
      },
    ],
  },
  // CERTIFICATE & CLEARANCE
  {
    id: "",
    name: "Processing of Request for Certification of Certificate of Registration (COR)/Authority to Print (ATP)/TIN  Card",
    duration: "6 Hours & 17 Minutes",
    fee: "PHP 130.00",
    service: "CERTIFICATE & CLEARANCE",
    category: "",
    requirements: [
      {
        id: "",
        name: "Letter Request bearing the letter head of the company; (1 original)",
        conditions: ["DEFAULT"],
      },
      {
        id: "",
        name: "Special Power of Attorney (SPA) executed by the taxpayer-applicant indicating specific transaction; [1 original for first time submission, if authorized to more than one transaction, submit certified true copy (together with the original copy for presentation and validation only)]",
        conditions: [
          "DEFAULT",
          "Individual Transacting through a Representative",
        ],
      },
      {
        id: "",
        name: "Any government-issued ID of the taxpayer and authorized representative. (1 photocopy, both with one specimen signature)",
        conditions: [
          "DEFAULT",
          "Individual Transacting through a Representative",
        ],
      },
      {
        id: "",
        name: "Board Resolution/Written Resolution (in case of OPC) or Secretary's Certificate, indicating the purpose and the name of the authorized representative; [1 original for first time submission, if authorized to more than one transaction, submit certified true copy (together with the original copy for presentation and validation only)]",
        conditions: [
          "DEFAULT",
          "Corporations/Non-individuals through a Representative",
        ],
      },
      {
        id: "",
        name: "Board Resolution/Written Resolution (in case of OPC) or Secretary's Certificate, indicating the purpose and the name of the authorized representative; [1 original for first time submission, if authorized to more than one transaction, submit certified true copy (together with the original copy for presentation and validation only)]",
        conditions: [
          "DEFAULT",
          "Corporations/Non-individuals through a Representative",
        ],
      },
      {
        id: "",
        name: "Board Resolution/Written Resolution (in case of OPC) or Secretary's Certificate, indicating the purpose and the name of the authorized representative; [1 original for first time submission, if authorized to more than one transaction, submit certified true copy (together with the original copy for presentation and validation only)]",
        optional: true,
        conditions: ["DEFAULT"],
      },
    ],
  },
];

export default transactions;
