import { Helmet } from 'react-helmet-async';

interface OrganizationSchemaProps {
  type?: 'Organization' | 'LocalBusiness' | 'SoftwareApplication';
}

export const OrganizationSchema = ({ type = 'Organization' }: OrganizationSchemaProps) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": type,
    "name": "Digitale Menukaart",
    "url": "https://digitalemenukaart.nl",
    "logo": "https://digitalemenukaart.nl/favicon.png",
    "description": "Maak eenvoudig een digitale menukaart voor uw restaurant met QR-code. Gasten scannen en bekijken direct uw menu op hun telefoon.",
    "foundingDate": "2024",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Dutch", "English"]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

interface SoftwareApplicationSchemaProps {
  name?: string;
  description?: string;
  price?: string;
  priceCurrency?: string;
}

export const SoftwareApplicationSchema = ({
  name = "Digitale Menukaart",
  description = "Digitale menukaart software voor restaurants met QR-code, online bestellen en betalingen.",
  price = "9.00",
  priceCurrency = "EUR"
}: SoftwareApplicationSchemaProps) => {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "QR-code menu generator",
      "Online bestellen",
      "iDEAL betalingen",
      "Meertalige ondersteuning",
      "Allergeenfilters",
      "Dashboard voor restauranteigenaren"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </script>
    </Helmet>
  );
};

interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>;
}

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://digitalemenukaart.nl${item.url}`
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

interface WebPageSchemaProps {
  title: string;
  description: string;
  url: string;
}

export const WebPageSchema = ({ title, description, url }: WebPageSchemaProps) => {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": `https://digitalemenukaart.nl${url}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Digitale Menukaart",
      "url": "https://digitalemenukaart.nl"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
      </script>
    </Helmet>
  );
};
