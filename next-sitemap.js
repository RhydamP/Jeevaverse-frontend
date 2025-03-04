const excludedPaths = ["/checkout", "/account/*", "/api/sitemap"];

module.exports = {
  siteUrl: process.env.SITE_URL || "https://localhost:8000",
  generateRobotsTxt: true,
  exclude: [...excludedPaths, "/[sitemap]"],
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
};
