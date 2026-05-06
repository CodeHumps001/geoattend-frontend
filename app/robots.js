export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/dashboard",
          "/courses",
          "/sessions",
          "/members",
          "/attendance",
          "/history",
          "/profile",
        ],
      },
    ],
    sitemap: "https://klassrep.vercel.app/sitemap.xml",
    host: "https://klassrep.vercel.app",
  };
}
