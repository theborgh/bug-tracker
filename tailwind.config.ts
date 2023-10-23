import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
      extend: {
      fontSize: {
        hl: [
          "2rem",
          { fontWeight: 400, lineHeight: "2.5rem", letterSpacing: "-0.5px" },
        ],
        hm: ["1.5rem", { fontWeight: 400, lineHeight: "1.5rem" }],
        hs: [
          "1.375rem",
          {
            fontWeight: 500,
            lineHeight: "1.71875rem",
            letterSpacing: "-0.25px",
          },
        ],
        hxs: ["1.125rem", { fontWeight: 500, lineHeight: "1.40625rem" }],
        hsb: [
          "0.9rem",
          { fontWeight: 700, lineHeight: "1.0156rem", letterSpacing: "2px" },
        ],
        bodym: ["0.9375rem", { fontWeight: 400, lineHeight: "1.171875rem" }],
        bodys: ["0.94rem", { fontWeight: 300, lineHeight: "1.015625rem" }],
      },
      colors: {
        "sidebar-border": "rgba(246, 240, 240, 0.16)",
        "bug-status-unassigned": "#FCA5A5",
        "bug-status-inprogress": "yellow",
        "bug-status-todo": "red",
        "bug-status-testing": "green",
        "bug-status-closed": "white",
      },
      
    },
  },
  plugins: [],
}
export default config
