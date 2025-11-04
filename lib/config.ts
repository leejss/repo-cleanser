const config = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
};

export const getConfig = (key: keyof typeof config) => {
  if (!config[key]) {
    throw new Error(`Config key ${key} not found`);
  }
  return config[key];
};
