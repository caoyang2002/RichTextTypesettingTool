import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
     './src/**/*.{js,ts,jsx,tsx,mdx}', // 使用通配符匹配所有文件
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e3f2fd",
          100: "#bbdefb",
          500: "#2196f3",
          600: "#1e88e5",
          700: "#1976d2",
        },
      },
    },
  },
  plugins: [],
};

export default config;
