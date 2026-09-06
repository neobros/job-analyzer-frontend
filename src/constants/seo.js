export const SITE_URL = 'https://www.liveinaus.com.au';
export const DEFAULT_TITLE = 'LiveInAus | Jobs, Housing, Migration & Local Services in Australia';
export const DEFAULT_DESCRIPTION =
  "LiveInAus is Australia's all-in-one marketplace for new arrivals and residents: find verified jobs, freelance services, accommodation, migration help, and everyday essentials in one trusted platform.";

// Static/semi-static page copy used for <title>/meta description on route change.
// Detail pages (job/gig/listing) override this once their own data loads.
export const PAGE_META = {
  // `title: null` lets useDocumentMeta fall back to the full DEFAULT_TITLE as-is,
  // instead of appending " | LiveInAus" a second time on top of it.
  home: {
    title: null,
    description: DEFAULT_DESCRIPTION
  },
  jobs: {
    title: 'Find Jobs in Australia',
    description: 'Search verified job listings across Australia. Filter by category, location, and job type, and apply directly with a protected profile.'
  },
  jobDetail: {
    title: 'Job Details',
    description: 'View this job listing on LiveInAus, Australia’s marketplace for new arrivals and residents.'
  },
  freelance: {
    title: 'Freelance Services in Australia',
    description: 'Hire skilled freelancers or sell your own services on LiveInAus — from creative work to trades and local support.'
  },
  freelanceDetail: {
    title: 'Freelance Service Details',
    description: 'View this freelance service listing on LiveInAus, Australia’s marketplace for new arrivals and residents.'
  },
  platform: {
    title: 'Explore Every Service for Life in Australia',
    description: 'Accommodation, education, migration, real estate, healthcare, and more — explore every category LiveInAus offers new arrivals and residents.'
  },
  platformVertical: {
    title: 'Explore Listings',
    description: 'Browse verified local listings on LiveInAus.'
  },
  listingDetail: {
    title: 'Listing Details',
    description: 'View this listing on LiveInAus, Australia’s marketplace for new arrivals and residents.'
  },
  profile: {
    title: 'My Profile',
    description: 'Manage your LiveInAus profile, applications, and listings.'
  },
  employer: {
    title: 'Employer Dashboard',
    description: 'Manage your job posts, applications, and listings on LiveInAus.'
  },
  login: {
    title: 'Log In',
    description: 'Log in to your LiveInAus account to manage jobs, applications, gigs, and listings.'
  },
  signup: {
    title: 'Create Your Free Account',
    description: 'Register for free on LiveInAus to search jobs, apply for work, post listings, and access every service for life in Australia.'
  },
  adminLogin: {
    title: 'Administrator Sign In',
    description: 'Restricted access for LiveInAus administrators.'
  },
  admin: {
    title: 'Admin Console',
    description: 'LiveInAus moderation and administration console.'
  }
};
