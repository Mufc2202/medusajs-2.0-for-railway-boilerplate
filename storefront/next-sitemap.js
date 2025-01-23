/** @type {import('next-sitemap').IConfig} */
'use client';

const excludedPaths = ["/checkout", "/account/*"]

module.exports = {
  siteUrl: 'https://dolgins.com',
  generateRobotsTxt: true,
  exclude: excludedPaths + ["/[sitemap]"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: excludedPaths,
      },
    ],
  },
}
