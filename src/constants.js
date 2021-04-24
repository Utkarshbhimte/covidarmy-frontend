export const isProduction = process.env.NODE_ENV === "production"
export const corsOptions = {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: isProduction ? ["arnavgosain.com", "vercel.app"] : "localhost",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

/** @type {import("next-seo").DefaultSeoProps} */
export const defaultSeoProps = {
    title: "Covid.army",
    description: "Verified Real Time List of COVID-19 Resources and Aid",
}

/** @type {import("next-seo").DefaultSeoProps} */
export const seoProps = {}