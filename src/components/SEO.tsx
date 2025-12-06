import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

const SEO = ({
  title,
  description,
  keywords = "digitale menukaart, QR code menu, restaurant menu, horeca, menukaart maken",
  canonicalUrl,
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  ogType = "website",
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title.includes("Digitale Menukaart") 
    ? title 
    : `${title} | Digitale Menukaart`;
  
  const baseUrl = "https://digitalemenukaart.nl";
  const canonical = canonicalUrl ? `${baseUrl}${canonicalUrl}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Digitale Menukaart" />
      <meta property="og:locale" content="nl_NL" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
