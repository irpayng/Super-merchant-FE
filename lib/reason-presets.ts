export interface ReasonPreset {
  /** Shown in the select dropdown */
  title: string;
  /** Populated into the reason textarea when selected */
  body: string;
}

/**
 * Predefined reasons for admin operations that require a reason. The `title`
 * shows in the select options; selecting one populates the `body` into the
 * reason textarea so the admin can send a detailed, consistent message — or
 * edit/replace it with a custom reason.
 */

/* ------------------------------------------------------------------ */
/* Address verification — rejection                                    */
/* ------------------------------------------------------------------ */
export const addressRejectionReasons: ReasonPreset[] = [
  {
    title: 'Document Not Legible',
    body: 'The uploaded document is blurry or unreadable. Please re-upload a clear, well-lit image where all details are fully visible.',
  },
  {
    title: 'Address Mismatch',
    body: 'The address on the uploaded document does not match the residential address provided during onboarding. Please upload a document that matches the address on file.',
  },
  {
    title: 'Expired Document',
    body: 'The document provided has expired. Please upload a recent proof of address issued within the last 3 months.',
  },
  {
    title: 'Name Mismatch',
    body: 'The name on the proof of address does not match the name on your profile. Please upload a document bearing your registered name.',
  },
  {
    title: 'Incomplete Document',
    body: 'The uploaded document is incomplete or missing required information. Please upload a complete proof of address showing your name, address, and issue date.',
  },
  {
    title: 'Unacceptable Document Type',
    body: 'The document type provided is not accepted as proof of address. Please upload a utility bill, bank statement, or tenancy agreement issued within the last 3 months.',
  },
];

/* ------------------------------------------------------------------ */
/* BVN verification — rejection                                        */
/* ------------------------------------------------------------------ */
export const bvnRejectionReasons: ReasonPreset[] = [
  {
    title: 'BVN Details Mismatch',
    body: 'The details linked to the BVN provided do not match the information on your profile. Please confirm and submit the BVN registered in your name.',
  },
  {
    title: 'Invalid BVN',
    body: 'The BVN provided is invalid or could not be found. Please check the number and submit a valid 11-digit BVN.',
  },
  {
    title: 'Name Mismatch',
    body: 'The name registered to this BVN does not match the name on your profile. Please provide the BVN registered in your name.',
  },
  {
    title: 'Date of Birth Mismatch',
    body: 'The date of birth linked to this BVN does not match the one on your profile. Please review your details and try again.',
  },
  {
    title: 'BVN Could Not Be Verified',
    body: 'We were unable to verify the BVN provided at this time. Please confirm your details and resubmit.',
  },
  {
    title: 'BVN Already in Use',
    body: 'The BVN provided is already linked to another account. Please contact support if you believe this is an error.',
  },
];

/* ------------------------------------------------------------------ */
/* NIN verification — rejection                                        */
/* ------------------------------------------------------------------ */
export const ninRejectionReasons: ReasonPreset[] = [
  {
    title: 'NIN Details Mismatch',
    body: 'The details linked to the NIN provided do not match the information on your profile. Please confirm and submit the NIN registered in your name.',
  },
  {
    title: 'Invalid NIN',
    body: 'The NIN provided is invalid or could not be found. Please check the number and submit a valid 11-digit NIN.',
  },
  {
    title: 'Name Mismatch',
    body: 'The name registered to this NIN does not match the name on your profile. Please provide the NIN registered in your name.',
  },
  {
    title: 'Date of Birth Mismatch',
    body: 'The date of birth linked to this NIN does not match the one on your profile. Please review your details and try again.',
  },
  {
    title: 'NIN Could Not Be Verified',
    body: 'We were unable to verify the NIN provided at this time. Please confirm your details and resubmit.',
  },
  {
    title: 'NIN Already in Use',
    body: 'The NIN provided is already linked to another account. Please contact support if you believe this is an error.',
  },
];

/* ------------------------------------------------------------------ */
/* CAC verification — rejection                                        */
/* ------------------------------------------------------------------ */
export const cacRejectionReasons: ReasonPreset[] = [
  {
    title: 'Invalid CAC Document',
    body: 'The CAC document provided is invalid or could not be verified. Please upload a valid Certificate of Incorporation or Business Name registration.',
  },
  {
    title: 'Business Name Mismatch',
    body: 'The business name on the CAC document does not match the business name on file. Please upload a document that matches your registered business name.',
  },
  {
    title: 'RC/BN Number Invalid',
    body: 'The RC/BN number on the document could not be verified with the Corporate Affairs Commission. Please confirm the registration number and resubmit.',
  },
  {
    title: 'Document Not Legible',
    body: 'The uploaded CAC document is blurry or unreadable. Please re-upload a clear, well-lit image where all details are fully visible.',
  },
  {
    title: 'Proprietor/Director Name Mismatch',
    body: 'The proprietor/director details on the CAC document do not match the account holder. Please upload a document showing the registered owner.',
  },
  {
    title: 'Incomplete Document',
    body: 'The uploaded CAC document is incomplete or missing required pages. Please upload the complete registration document.',
  },
  {
    title: 'Inactive/Expired Registration',
    body: 'The business registration appears inactive or expired. Please provide an up-to-date CAC document reflecting an active registration.',
  },
];

/* ------------------------------------------------------------------ */
/* Agent & Merchant (business) applications — rejection                */
/* ------------------------------------------------------------------ */
export const businessApplicationRejectionReasons: ReasonPreset[] = [
  {
    title: 'Incomplete Application',
    body: 'Your application is missing required information. Please complete all required fields and supporting documents, then resubmit.',
  },
  {
    title: 'Failed KYC Verification',
    body: 'We could not complete your KYC verification. Please ensure your BVN, NIN, and identity details are accurate and resubmit.',
  },
  {
    title: 'Address Verification Failed',
    body: 'We were unable to verify your business or residential address. Please provide a valid, recent proof of address and resubmit.',
  },
  {
    title: 'Business Information Mismatch',
    body: 'The business information provided does not match our records or your supporting documents. Please review your details and resubmit.',
  },
  {
    title: 'Ineligible Location or Category',
    body: 'Your application does not meet the eligibility criteria for your location or business category at this time.',
  },
  {
    title: 'Duplicate Application',
    body: 'An existing application or account was found for these details. Please contact support if you believe this is an error.',
  },
  {
    title: 'Suspected Fraudulent Activity',
    body: 'Your application could not be approved following a routine review. Please contact support for further assistance.',
  },
];

/* ------------------------------------------------------------------ */
/* Post No Debit (PND) — apply                                         */
/* ------------------------------------------------------------------ */
export const pndApplyReasons: ReasonPreset[] = [
  {
    title: 'Suspected Fraudulent Activity',
    body: 'A restriction has been placed on this account due to suspected fraudulent activity pending investigation.',
  },
  {
    title: 'Pending Investigation',
    body: 'A debit restriction has been applied while an ongoing investigation into account activity is concluded.',
  },
  {
    title: 'Regulatory/Compliance Hold',
    body: 'A debit restriction has been applied to comply with a regulatory or compliance requirement.',
  },
  {
    title: 'Suspicious Transaction Pattern',
    body: 'Unusual transaction activity was detected. Debits have been restricted while the activity is reviewed.',
  },
  {
    title: 'Chargeback/Dispute Under Review',
    body: 'A debit restriction has been applied while a chargeback or transaction dispute is under review.',
  },
  {
    title: 'Outstanding KYC Requirement',
    body: 'A debit restriction has been applied pending completion of outstanding KYC requirements.',
  },
  {
    title: 'Court Order/Law Enforcement Request',
    body: 'A debit restriction has been applied in response to a court order or law enforcement request.',
  },
];

/* ------------------------------------------------------------------ */
/* Post No Debit (PND) — remove                                        */
/* ------------------------------------------------------------------ */
export const pndRemoveReasons: ReasonPreset[] = [
  {
    title: 'Investigation Concluded — No Issues',
    body: 'The investigation has been concluded with no issues found. The debit restriction has been lifted.',
  },
  {
    title: 'Compliance Clearance Granted',
    body: 'Compliance review is complete and clearance has been granted. The debit restriction has been removed.',
  },
  {
    title: 'Required Documentation Provided',
    body: 'The required documentation has been provided and verified. The debit restriction has been lifted.',
  },
  {
    title: 'Dispute Resolved',
    body: 'The associated dispute or chargeback has been resolved. The debit restriction has been removed.',
  },
  {
    title: 'KYC Requirements Completed',
    body: 'Outstanding KYC requirements have been completed. The debit restriction has been lifted.',
  },
  {
    title: 'Applied in Error',
    body: 'The debit restriction was applied in error and has now been removed. We apologise for any inconvenience.',
  },
];

/* ------------------------------------------------------------------ */
/* User suspension — shown on the lock screen                          */
/* ------------------------------------------------------------------ */
export const suspendReasons: ReasonPreset[] = [
  {
    title: 'Suspected Fraudulent Activity',
    body: 'Your account has been suspended due to suspected fraudulent activity. Please contact support to resolve this.',
  },
  {
    title: 'Violation of Terms of Service',
    body: 'Your account has been suspended for a violation of our Terms of Service. Please contact support for more information.',
  },
  {
    title: 'Pending Compliance Review',
    body: 'Your account has been temporarily suspended pending a compliance review. Please contact support for assistance.',
  },
  {
    title: 'Security Concern',
    body: 'Your account has been suspended due to a security concern. Please contact support to verify your identity and restore access.',
  },
  {
    title: 'Multiple Failed Verification Attempts',
    body: 'Your account has been suspended after multiple failed verification attempts. Please contact support to restore access.',
  },
  {
    title: 'Customer Request',
    body: 'Your account has been suspended at your request. Please contact support when you wish to reactivate it.',
  },
];

/* ------------------------------------------------------------------ */
/* User block — admin-facing internal note (the blocked user never     */
/* sees this; they're rejected at sign-in and can't reach any screen). */
/* ------------------------------------------------------------------ */
export const blockReasons: ReasonPreset[] = [
  {
    title: 'Confirmed Fraud',
    body: 'Account blocked following confirmed fraudulent activity.',
  },
  {
    title: 'Law Enforcement / Regulatory Directive',
    body: 'Account blocked on the instruction of law enforcement or a regulatory body.',
  },
  {
    title: 'Serious Terms of Service Breach',
    body: 'Account permanently blocked for a serious breach of our Terms of Service.',
  },
  {
    title: 'Chargeback / Settlement Abuse',
    body: 'Account blocked due to repeated chargeback or settlement abuse.',
  },
  {
    title: 'Duplicate / Fraudulent Onboarding',
    body: 'Account blocked — identity was created with fraudulent or duplicated onboarding details.',
  },
];

/* ------------------------------------------------------------------ */
/* Dispute management — customer quick responses                       */
/* ------------------------------------------------------------------ */

/**
 * Canned responses a dispute officer can drop into the dispute chat for a
 * fast, consistent reply to the customer. Selecting one populates the message
 * box (which stays fully editable) so the officer can personalise it — add the
 * customer's name, an amount, a reference, or a specific timeline — before
 * sending.
 *
 * The `title` shows in the quick-response dropdown; the `body` is the message
 * text. Grouped by dispute lifecycle stage with a `[Category]` prefix in the
 * title so the long list stays scannable in the dropdown.
 */
export const disputeQuickResponses: ReasonPreset[] = [
  /* --- Acknowledgement ------------------------------------------- */
  {
    title: '[Ack] Complaint Received',
    body: 'Thank you for reaching out. We have received your complaint and a member of our team is reviewing it. We will get back to you within 24 hours.',
  },
  {
    title: '[Ack] Apology for the Inconvenience',
    body: 'We sincerely apologise for the inconvenience this has caused. Please be assured that we are working to resolve this for you, typically within 24 hours.',
  },
  {
    title: '[Ack] Thank You for Your Patience',
    body: 'Thank you for your patience while we look into this. We understand how important this is and we are giving it our full attention. You can expect an update from us within 24 hours.',
  },

  /* --- Investigation in progress --------------------------------- */
  {
    title: '[Investigating] Under Review',
    body: 'Your dispute is currently under investigation. We are reviewing the transaction details and will update you with an outcome within 24 to 48 hours.',
  },
  {
    title: '[Investigating] Confirming with Bank/Provider',
    body: 'We are confirming the status of this transaction with the bank/provider involved. Their response typically takes 24 to 72 hours, and we will update you the moment we hear back.',
  },
  {
    title: '[Investigating] Escalated to Relevant Team',
    body: 'Your complaint has been escalated to the relevant team for further investigation. They will review it within 48 to 72 hours and we will keep you updated on the progress.',
  },
  {
    title: '[Investigating] Expected Resolution Timeline',
    body: 'We are actively working on your dispute and expect to have it resolved within 24 to 48 hours. We appreciate your patience.',
  },

  /* --- Requesting more information ------------------------------- */
  {
    title: '[Info Needed] Transaction Reference',
    body: 'To help us resolve this faster, please share the transaction reference or the date, time, and amount of the affected transaction. Once we receive it, we will update you within 24 hours.',
  },
  {
    title: '[Info Needed] Recipient Account Details',
    body: 'Please provide the recipient account number and bank name for the transaction in question so we can trace it accurately. We will revert within 24 hours of receiving the details.',
  },
  {
    title: '[Info Needed] Proof / Screenshot',
    body: 'Kindly share a screenshot or proof of the transaction (debit alert, receipt, or statement entry) so we can investigate further. We will respond within 24 hours of receiving it.',
  },
  {
    title: '[Info Needed] Confirm Details to Proceed',
    body: 'We need a few more details to proceed with your dispute. Please confirm the information requested so we can continue and resolve this within 24 hours.',
  },

  /* --- Reversal / refund ----------------------------------------- */
  {
    title: '[Reversal] Reversal Initiated',
    body: 'A reversal has been initiated for this transaction. Pending reversals typically take up to 24 hours to reflect in your wallet/account. Thank you for your patience.',
  },
  {
    title: '[Reversal] Reversal Completed',
    body: 'The reversal for this transaction has been completed and the funds have been credited back. Please confirm — if you do not see it, allow up to 24 hours for it to fully reflect.',
  },
  {
    title: '[Reversal] Refund Within 24 Hours',
    body: 'Your refund is being processed and should reflect within 24 hours. We will notify you once it is completed.',
  },
  {
    title: '[Reversal] Failed Transaction Refunded',
    body: 'We have confirmed that the transaction failed and the amount has been refunded. It should reflect within 24 hours depending on your bank. Kindly check and confirm.',
  },

  /* --- Successful but not credited ------------------------------- */
  {
    title: '[Not Credited] Confirming Value Delivery',
    body: 'We are confirming whether value was delivered for this transaction with the provider. This usually takes 24 to 72 hours; if value was not delivered, a refund will be processed immediately afterwards.',
  },
  {
    title: '[Not Credited] Awaiting Provider Confirmation',
    body: 'The transaction is being verified with the service provider, which typically takes 24 to 72 hours. Once they confirm the status, we will resolve this right away.',
  },
  {
    title: '[Not Credited] Value Confirmed Delivered',
    body: 'Our records and the provider confirm that value was successfully delivered for this transaction. Please check again, and share any evidence to the contrary within 24 hours so we can investigate further.',
  },

  /* --- Wrong transfer -------------------------------------------- */
  {
    title: '[Wrong Transfer] Recall Initiated',
    body: 'We have initiated a recall for the funds sent to the wrong recipient. Recalls depend on the receiving bank and the availability of funds, and typically take 3 to 5 working days. We will update you on the outcome.',
  },
  {
    title: '[Wrong Transfer] Recipient Bank Contacted',
    body: 'We have contacted the recipient bank regarding the wrong transfer. Resolution is subject to their process and the recipient\u2019s cooperation, and usually takes 3 to 5 working days. We will keep you informed.',
  },
  {
    title: '[Wrong Transfer] Recall Not Guaranteed',
    body: 'Please note that while we have initiated a recall (which typically takes 3 to 5 working days), the return of funds sent to a wrong but valid account cannot be guaranteed, as it depends on the recipient and their bank.',
  },

  /* --- Resolution / outcome -------------------------------------- */
  {
    title: '[Resolved] Issue Resolved',
    body: 'We are pleased to inform you that your dispute has been resolved. Where a refund applies, please allow up to 24 hours for it to reflect. Thank you for bringing this to our attention, and please reach out if you have any further questions.',
  },
  {
    title: '[Resolved] No Error Found',
    body: 'After a thorough review, we found that this transaction was processed correctly and no error occurred. If you have additional information, please share it within 24 hours and we will gladly take another look.',
  },
  {
    title: '[Resolved] Closing the Dispute',
    body: 'As this matter has now been resolved, we will be closing this dispute. Thank you for your patience and for banking with us. Feel free to open a new request if you need further help.',
  },

  /* --- Holding / follow-up --------------------------------------- */
  {
    title: '[Follow-up] Still Working On It',
    body: 'We wanted to let you know that we are still working on your dispute and have not forgotten about it. We expect to have an update for you within the next 24 hours.',
  },
  {
    title: '[Follow-up] Pending Third-Party Response',
    body: 'Resolution is currently pending a response from a third party (bank/provider), which typically takes 24 to 72 hours. We are following up on our end and will update you once we hear back.',
  },
  {
    title: '[Follow-up] Refund Reflecting Timeline',
    body: 'Reversals typically take up to 24 hours to reflect depending on your bank. If you do not see the credit after 24 hours, please let us know and we will follow up immediately.',
  },
];
