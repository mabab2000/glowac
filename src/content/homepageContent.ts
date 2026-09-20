export type HomeCertification = {
  id: string;
  name: string;
  image: string;
  detail: string;
};

export type HomepageCopy = {
  relationshipLead: string;
  relationshipAccent: string;
  relationshipDescription: string;
  commitmentTitle: string;
  commitmentParagraphs: string[];
  certificationsTitle: string;
  certifications: HomeCertification[];
  whyTitle: string;
  whyDescription: string;
};

export const HOMEPAGE_COPY_KEY = 'home.pageCopy';

export const DEFAULT_HOMEPAGE_COPY: HomepageCopy = {
  relationshipLead: 'Building Strong',
  relationshipAccent: 'Relationships',
  relationshipDescription:
    'GLOWAC is a Geotechnical Engineering firm and performs Architectural and Engineering activities and related technical consultancy services to coordinates specialist trades for industrial/commercial projects.',
  commitmentTitle: 'Our Commitment to Excellence',
  commitmentParagraphs: [
    'GLOWAC is committed to building strong relationships with clients by providing exceptional customer service, the highest quality legally defensible data.',
    'Besides training, experience and knowledge of the GLOWAC team members, their values are merged to reflect the following criteria for business success.',
    'Our focus on quality, instrumentation, and adherence to recognised standards ensures reliable results for engineers, contractors, and researchers.',
  ],
  certificationsTitle: 'Our Certifications',
  certifications: [
    {
      id: 'engineer-certification',
      name: 'Engineer Certification',
      image: '/images/engineer-logo.png',
      detail: 'Member',
    },
    {
      id: 'rsb-certification',
      name: 'Rwanda Standards Board',
      image: '/images/rsb-icon.png',
      detail: 'ISO/IEC 17025:2027',
    },
  ],
  whyTitle: 'Why Choose Us',
  whyDescription:
    "We combine deep technical expertise with a commitment to client success — delivering reliable, timely, and cost-effective geotechnical solutions tailored to your project's needs.",
};

export const loadHomepageCopy = (): HomepageCopy => {
  if (typeof window === 'undefined') return DEFAULT_HOMEPAGE_COPY;

  try {
    const saved = window.localStorage.getItem(HOMEPAGE_COPY_KEY);
    if (!saved) return DEFAULT_HOMEPAGE_COPY;

    const parsed = JSON.parse(saved) as Partial<HomepageCopy>;
    return {
      ...DEFAULT_HOMEPAGE_COPY,
      ...parsed,
      commitmentParagraphs: Array.isArray(parsed.commitmentParagraphs)
        ? parsed.commitmentParagraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string')
        : DEFAULT_HOMEPAGE_COPY.commitmentParagraphs,
      certifications: Array.isArray(parsed.certifications)
        ? parsed.certifications.filter((certification): certification is HomeCertification => (
            typeof certification?.id === 'string' &&
            typeof certification?.name === 'string' &&
            typeof certification?.image === 'string' &&
            typeof certification?.detail === 'string'
          ))
        : DEFAULT_HOMEPAGE_COPY.certifications,
    };
  } catch {
    return DEFAULT_HOMEPAGE_COPY;
  }
};

export const saveHomepageCopy = (content: HomepageCopy) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(HOMEPAGE_COPY_KEY, JSON.stringify(content));
  }
};
