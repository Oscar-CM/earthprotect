const API_VERSION = '2025-01'

export type ShopifyVariant = {
  id: string
  title: string
  price: string
  available: boolean
  selectedOptions: { name: string; value: string }[]
}

export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  descriptionHtml: string
  status: string
  productType: string
  tags: string[]
  totalInventory: number
  featuredImage: { url: string } | null
  images: { edges: { node: { url: string } }[] }
  priceRangeV2: { minVariantPrice: { amount: string } }
  variants: { edges: { node: ShopifyVariant }[] }
}

export type ShopItemVariant = {
  id: string
  title: string
  price: number
  available: boolean
  options: Record<string, string>
}

function stripHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function numericId(gid: string) {
  return gid.split('/').pop() ?? gid
}

const CATEGORY_KEYWORDS: Record<string, string> = {
  apparel: 'apparel',
  shirt: 'apparel',
  tee: 'apparel',
  hoodie: 'apparel',
  hat: 'apparel',
  embroidery: 'apparel',
  print: 'prints',
  poster: 'prints',
  art: 'prints',
  digital: 'digital',
  ebook: 'digital',
}

export function mapShopifyCategory(productType: string) {
  const lower = productType.toLowerCase()
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lower.includes(keyword)) return category
  }
  return 'accessories'
}

export function shopifyProductToShopItem(product: ShopifyProduct) {
  const images = product.images.edges.map(e => e.node.url)
  const variants: ShopItemVariant[] = product.variants.edges.map(e => ({
    id: numericId(e.node.id),
    title: e.node.title,
    price: parseFloat(e.node.price),
    available: e.node.available,
    options: Object.fromEntries(e.node.selectedOptions.map(o => [o.name, o.value])),
  }))

  return {
    shopifyId: product.id,
    slug: product.handle,
    name: product.title,
    description: stripHtml(product.descriptionHtml),
    price: parseFloat(product.priceRangeV2.minVariantPrice.amount),
    imageUrl: product.featuredImage?.url ?? images[0] ?? '',
    images: images.length > 1 ? images : [],
    category: mapShopifyCategory(product.productType),
    tags: product.tags,
    inStock: product.totalInventory > 0,
    published: product.status === 'ACTIVE',
    variants: variants.length > 1 ? variants : [],
  }
}

const PRODUCTS_QUERY = `
  query Products($cursor: String) {
    products(first: 50, after: $cursor) {
      edges {
        node {
          id
          handle
          title
          descriptionHtml
          status
          productType
          tags
          totalInventory
          featuredImage { url }
          images(first: 10) {
            edges { node { url } }
          }
          priceRangeV2 { minVariantPrice { amount } }
          variants(first: 100) {
            edges {
              node {
                id
                title
                price
                availableForSale
                selectedOptions { name value }
              }
            }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`

type RawVariantNode = {
  id: string
  title: string
  price: string
  availableForSale: boolean
  selectedOptions: { name: string; value: string }[]
}

type RawProductNode = Omit<ShopifyProduct, 'variants'> & {
  variants: { edges: { node: RawVariantNode }[] }
}

export async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

  if (!domain || !token) {
    throw new Error('SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN must be set in .env.local')
  }

  const products: ShopifyProduct[] = []
  let cursor: string | null = null

  while (true) {
    const res: Response = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY, variables: { cursor } }),
    })

    if (!res.ok) {
      throw new Error(`Shopify API request failed: ${res.status} ${res.statusText}`)
    }

    const json: { errors?: unknown; data: { products: { edges: { node: RawProductNode }[]; pageInfo: { hasNextPage: boolean; endCursor: string } } } } = await res.json()
    if (json.errors) {
      throw new Error(`Shopify API error: ${JSON.stringify(json.errors)}`)
    }

    const { edges, pageInfo } = json.data.products
    products.push(...edges.map(e => ({
      ...e.node,
      variants: {
        edges: e.node.variants.edges.map(v => ({
          node: {
            id: v.node.id,
            title: v.node.title,
            price: v.node.price,
            available: v.node.availableForSale,
            selectedOptions: v.node.selectedOptions,
          },
        })),
      },
    })))

    if (!pageInfo.hasNextPage) break
    cursor = pageInfo.endCursor
  }

  return products
}
