/* 
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = "menu-sub-hidden";

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = "th";
export const localeOptions = [
  { id: "th", name: "ไทย" },
  { id: "en", name: "English" },
];

export const searchPath = "/app/pages/search";
export const servicePath = "https://api.planforfit.com/actdev";

/* 
Color Options:
"light.purple", "light.blue", "light.green", "light.orange", "light.red", "dark.purple", "dark.blue", "dark.green", "dark.orange", "dark.red"
*/
export const isMultiColorActive = false;
export const defaultColor = "light.blue";

// Product name/id of this application that refer in DB
export const productName = "bemoove";

const dev = {
  API: {
      endpoints: [
          {
              name: "bebe",
              endpoint: process.env.REACT_APP_STAGE === 'dev' 
                ? "https://api.planforfit.com/bebedev" 
                : "http://localhost:3003",
              region: "ap-southeast-1"
          }
      ]
  }
}

const prod = {
  API: {
      endpoints: [
          {
              name: "bebe",
              endpoint: "https://api.planforfit.com/bebe",
              region: "ap-southeast-1"
          }
      ]
  }
}

const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export const awsConfig = {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
