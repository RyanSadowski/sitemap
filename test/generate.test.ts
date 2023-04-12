import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { buildNuxt, createResolver, loadNuxt } from '@nuxt/kit'

describe('generate', () => {
  it('basic', async () => {
    process.env.NODE_ENV = 'production'
    process.env.prerender = true
    process.env.NUXT_PUBLIC_SITE_URL = 'https://nuxt-simple-sitemap.com'
    const { resolve } = createResolver(import.meta.url)
    const rootDir = resolve('../.playground')
    const nuxt = await loadNuxt({
      rootDir,
      overrides: {
        _generate: true,
        sitemap: {
          autoLastmod: false,
        },
      },
    })

    await buildNuxt(nuxt)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const sitemap = (await readFile(resolve(rootDir, '.output/public/sitemap_index.xml'), 'utf-8')).replace(/lastmod>(.*?)</g, 'lastmod><')
    // ignore lastmod entries
    expect(sitemap).toMatchInlineSnapshot(`
      "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><?xml-stylesheet type=\\"text/xsl\\" href=\\"/__sitemap__/style.xsl\\"?>
      <sitemapindex xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\">
          <sitemap>
              <loc>https://nuxt-simple-sitemap.com/posts-sitemap.xml</loc>
          </sitemap>
          <sitemap>
              <loc>https://nuxt-simple-sitemap.com/pages-sitemap.xml</loc>
              <lastmod></lastmod>
          </sitemap>
      </sitemapindex>
      <!-- XML Sitemap generated by Nuxt Simple Sitemap -->"
    `)

    const pages = (await readFile(resolve(rootDir, '.output/public/pages-sitemap.xml'), 'utf-8')).replace(/lastmod>(.*?)</g, 'lastmod><')
    expect(pages).toMatchInlineSnapshot(`
      "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><?xml-stylesheet type=\\"text/xsl\\" href=\\"/__sitemap__/style.xsl\\"?>
      <urlset xmlns:xsi=\\"http://www.w3.org/2001/XMLSchema-instance\\" xmlns:xhtml=\\"http://www.w3.org/1999/xhtml\\" xmlns:image=\\"http://www.google.com/schemas/sitemap-image/1.1\\" xsi:schemaLocation=\\"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd\\" xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\">
          <url>
              <loc>https://nuxt-simple-sitemap.com</loc>
              <xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://nuxt-simple-sitemap.com/fr\\" />
          </url>
          <url>
              <loc>https://nuxt-simple-sitemap.com/bar</loc>
              <xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://nuxt-simple-sitemap.com/fr/bar\\" />
          </url>
          <url>
              <loc>https://nuxt-simple-sitemap.com/foo</loc>
              <xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://nuxt-simple-sitemap.com/fr/foo\\" />
          </url>
          <url>
              <loc>https://nuxt-simple-sitemap.com/about</loc>
              <xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://nuxt-simple-sitemap.com/fr/about\\" />
              <image:image>
                  <image:loc>https://example.com/image.jpg</image:loc>
              </image:image>
              <image:image>
                  <image:loc>https://example.com/image2.jpg</image:loc>
              </image:image>
              <image:image>
                  <image:loc>https://res.cloudinary.com/dl6o1xpyq/image/upload/f_jpg,q_auto:best,dpr_auto,w_240,h_240/images/harlan-wilton</image:loc>
              </image:image>
              <lastmod></lastmod>
              <changefreq>daily</changefreq>
              <priority>0.3</priority>
          </url>
          <url>
              <loc>https://nuxt-simple-sitemap.com/new-page</loc>
              <xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://nuxt-simple-sitemap.com/fr/new-page\\" />
              <image:image>
                  <image:loc>https://res.cloudinary.com/dl6o1xpyq/image/upload/f_jpg,q_auto:best,dpr_auto,w_240,h_240/images/harlan-wilton</image:loc>
              </image:image>
          </url>
          <url>
              <loc>https://nuxt-simple-sitemap.com/users-lazy/1</loc>
              <xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://nuxt-simple-sitemap.com/fr/users-lazy/1\\" />
          </url>
          <url>
              <loc>https://nuxt-simple-sitemap.com/users-lazy/2</loc>
              <xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://nuxt-simple-sitemap.com/fr/users-lazy/2\\" />
          </url>
          <url>
              <loc>https://nuxt-simple-sitemap.com/users-lazy/3</loc>
              <xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://nuxt-simple-sitemap.com/fr/users-lazy/3\\" />
          </url>
          <url>
              <loc>https://nuxt-simple-sitemap.com/users-prerender</loc>
              <xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://nuxt-simple-sitemap.com/fr/users-prerender\\" />
          </url>
          <url>
              <loc>https://nuxt-simple-sitemap.com/hidden-path-but-in-sitemap</loc>
              <xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://nuxt-simple-sitemap.com/fr/hidden-path-but-in-sitemap\\" />
          </url>
      </urlset>
      <!-- XML Sitemap generated by Nuxt Simple Sitemap -->"
    `)
  }, 60000)
})
