const SITE_URL = "https://tinchess.com";
const LOGO_URL = `${SITE_URL}/images/logo.png`;
const SOCIAL_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/2ct2VN5KWaTvZqbEGBRuPehU07W2/social-images/social-1773339573544-TIN_logo.webp";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "The Intellect Nest",
  alternateName: "TIN Chess",
  url: SITE_URL,
  logo: LOGO_URL,
  image: SOCIAL_IMAGE,
  description:
    "India's premier online chess academy for kids aged 5–15. Live coach-led sessions, weekly tournaments, and monthly progress reports.",
  telephone: "+919893189566",
  email: "info@tinchess.com",
  foundingDate: "2022",
  sameAs: [
    "https://www.instagram.com/the_intellectnest/",
    "https://www.youtube.com/@TheIntellectNest64",
    "https://bit.ly/fb_theintellectnest",
    "https://www.linkedin.com/company/theintellectnest/",
    "https://www.x.com/IntellectT43247",
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "311, Asawa Chambers, Sapna Sangeeta Rd",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      postalCode: "452001",
      addressCountry: "IN",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "26, Krishna Market, Lajpat Nagar 1",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      addressCountry: "IN",
    },
  ],
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 22.7196, longitude: 75.8577 },
    geoRadius: "20000000",
  },
  priceRange: "₹2,999–₹4,999/month",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "500",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Intellect Nest",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function courseSchema(
  name: string,
  description: string,
  ageRange: string,
  price: string,
  currency: string,
  image?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "The Intellect Nest",
      url: SITE_URL,
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      suggestedAge: ageRange,
    },
    educationalLevel: name,
    isAccessibleForFree: false,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/courses`,
    },
    deliveryMode: "online",
    image: image || LOGO_URL,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      instructor: {
        "@type": "Organization",
        name: "The Intellect Nest",
      },
    },
  };
}

export function faqPageSchema(
  items: { q: string; a: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function blogPostingSchema(
  title: string,
  slug: string,
  description: string,
  image: string,
  category: string,
  readTime: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    url: `${SITE_URL}/blog/${slug}`,
    author: {
      "@type": "Organization",
      name: "The Intellect Nest",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "The Intellect Nest",
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    articleSection: category,
    timeRequired: `PT${parseInt(readTime)}M`,
    inLanguage: "en",
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
