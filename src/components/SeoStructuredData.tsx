
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OrganizationProps {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

interface WebsiteProps {
  name?: string;
  url?: string;
}

interface AuthorProps {
  name?: string;
  url?: string;
}

interface ArticleProps {
  headline?: string;
  image?: string;
  author?: AuthorProps;
  publisher?: OrganizationProps;
  datePublished?: string;
  dateModified?: string;
  description?: string;
}

interface SeoStructuredDataProps {
  type: 'Organization' | 'Website' | 'Article' | 'BreadcrumbList';
  data: OrganizationProps | WebsiteProps | ArticleProps | any;
}

const SeoStructuredData: React.FC<SeoStructuredDataProps> = ({ type, data }) => {
  const getJsonLd = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: data.name || 'Maker Brains',
          url: data.url || 'https://makerbrains.com',
          logo: data.logo || 'https://makerbrains.com/logo.png',
          sameAs: data.sameAs || [
            'https://www.youtube.com/@makerbrains',
            'https://github.com/MukeshSankhla',
            'https://www.linkedin.com/in/mukeshsankhla/',
            'https://www.instagram.com/makerbrains_official/'
          ]
        };
      case 'Website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: data.name || 'Maker Brains',
          url: data.url || 'https://makerbrains.com',
        };
      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.headline,
          image: data.image,
          author: {
            '@type': 'Person',
            name: data.author?.name || 'Mukesh Sankhla',
            url: data.author?.url || 'https://makerbrains.com/about-me'
          },
          publisher: {
            '@type': 'Organization',
            name: data.publisher?.name || 'Maker Brains',
            logo: {
              '@type': 'ImageObject',
              url: data.publisher?.logo || 'https://makerbrains.com/logo.png'
            }
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified || data.datePublished,
          description: data.description
        };
      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.itemListElement
        };
      default:
        return {};
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getJsonLd())}
      </script>
    </Helmet>
  );
};

export default SeoStructuredData;
