export interface LandingFaq {
  question: string;
  answer: string;
}

export const LANDING_FAQS: LandingFaq[] = [
  {
    question: 'Which listings can I analyse?',
    answer:
      'Rightmove, OnTheMarket, and Zoopla property pages are supported — links like https://www.rightmove.co.uk/properties/173188025, https://www.onthemarket.com/details/19498710, or https://www.zoopla.co.uk/for-sale/details/71153465.',
  },
  {
    question: 'Can I analyse a standard buy to let?',
    answer:
      'Yes. Choose Buy to let before you start. That scores a whole-house family AST instead of HMO conversion schemes. HMO conversion remains the default.',
  },
  {
    question: 'Do I need an account to try it?',
    answer:
      'You can paste a link first. We ask you to sign in or create an account just before the analysis runs, then the result appears on the same page.',
  },
  {
    question: 'What does an analysis cost?',
    answer:
      'Each listing uses one analysis. Proposed layouts use three analyses from the same balance. New accounts start on the Free plan with 5 listing analyses, and paid plans add more each month.',
  },
  {
    question: 'How long does a report take?',
    answer:
      'Most analyses finish in 15–40 seconds. You can leave the page open and the report updates as soon as it is ready.',
  },
  {
    question: 'Can I change or cancel my plan?',
    answer:
      'Yes. Subscriptions are managed through Stripe, and you can upgrade, downgrade or cancel any time from the billing page.',
  },
  {
    question: 'Can I share a report?',
    answer:
      'Starter plans and above can export every completed analysis as a PDF from the report page. Your past analyses stay under your properties.',
  },
];
