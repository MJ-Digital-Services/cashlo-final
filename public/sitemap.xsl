<?xml version="1.0" encoding="UTF-8"?>
<!--
  Purely cosmetic: makes /sitemap.xml and its sub-sitemaps render as a
  clickable, readable table when opened directly in a browser. Search
  engines and other sitemap consumers fetch the raw XML and ignore this
  <?xml-stylesheet?> processing instruction entirely, so it has zero effect
  on crawling/indexing - only on how a human sees it in a browser tab.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <meta charset="UTF-8"/>
        <meta name="robots" content="noindex"/>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 32px; color: #1a1a2e; background: #fafafa; }
          h1 { font-size: 20px; margin: 0 0 4px; }
          p.count { color: #667; margin: 0 0 20px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5e5ec; border-radius: 8px; overflow: hidden; }
          th { text-align: left; padding: 10px 14px; background: #f3f3f8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; color: #667; border-bottom: 1px solid #e5e5ec; }
          td { padding: 10px 14px; border-bottom: 1px solid #f0f0f5; font-size: 13px; vertical-align: top; }
          tr:last-child td { border-bottom: none; }
          a { color: #6d28d9; text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .muted { color: #99a; }
        </style>
      </head>
      <body>
        <xsl:choose>
          <xsl:when test="//*[local-name()='sitemapindex']">
            <h1>Sitemap Index</h1>
            <p class="count">
              <xsl:value-of select="count(//*[local-name()='sitemap'])"/> sub-sitemaps
            </p>
            <table>
              <tr><th>Sitemap</th></tr>
              <xsl:for-each select="//*[local-name()='sitemap']">
                <tr>
                  <td>
                    <a href="{*[local-name()='loc']}">
                      <xsl:value-of select="*[local-name()='loc']"/>
                    </a>
                  </td>
                </tr>
              </xsl:for-each>
            </table>
          </xsl:when>
          <xsl:otherwise>
            <h1>Sitemap</h1>
            <p class="count">
              <xsl:value-of select="count(//*[local-name()='url'])"/> URLs
            </p>
            <table>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
              <xsl:for-each select="//*[local-name()='url']">
                <tr>
                  <td>
                    <a href="{*[local-name()='loc']}">
                      <xsl:value-of select="*[local-name()='loc']"/>
                    </a>
                  </td>
                  <td class="muted"><xsl:value-of select="*[local-name()='lastmod']"/></td>
                  <td class="muted"><xsl:value-of select="*[local-name()='changefreq']"/></td>
                  <td class="muted"><xsl:value-of select="*[local-name()='priority']"/></td>
                </tr>
              </xsl:for-each>
            </table>
          </xsl:otherwise>
        </xsl:choose>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
