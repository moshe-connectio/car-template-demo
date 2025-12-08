import { dealershipConfig } from '@core/config/site.config';
import { getVehicleBySlug } from '@modules/vehicles/lib/repository';

// Server-side head for vehicle detail: enables rich link previews (WhatsApp, Facebook, etc.)
export default async function Head({ params }: { params: { slug: string } }) {
  const vehicle = await getVehicleBySlug(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const canonical = `${siteUrl.replace(/\/$/, '')}/vehicles/${params.slug}`;

  const title = vehicle
    ? `${vehicle.title} | ${dealershipConfig.business.name}`
    : dealershipConfig.seo.title;

  const description =
    vehicle?.short_description || dealershipConfig.seo.description || dealershipConfig.business.tagline;

  const image =
    vehicle?.main_image_url || vehicle?.images?.[0]?.image_url || dealershipConfig.business.logo || '/logo.png';

  const structuredData = vehicle
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: vehicle.title,
        description: description,
        image: image,
        url: canonical,
        brand: vehicle.brand,
        model: vehicle.model,
        productionDate: vehicle.year?.toString(),
        offers: {
          '@type': 'Offer',
          price: vehicle.price,
          priceCurrency: dealershipConfig.payment.currency || 'ILS',
          availability: vehicle.is_published ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      }
    : null;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
    </>
  );
}
