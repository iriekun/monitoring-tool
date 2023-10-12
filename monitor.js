import axios from "axios";

export const monitor = async (site) => {
  let result;
  try {
    const startTime = Date.now();
    const response = await axios.get(site.url);

    if (response.data.includes(site.contentRequirement)) {
      result = {
        url: site.url,
        status: 'OK',
        responseTime: Date.now() - startTime,
      };
    } else {
      result = {
        url: site.url,
        status: 'Content mismatch',
        responseTime: Date.now() - startTime,
      };
    }
  } catch (error) {
    result = {
      url: site.url,
      status: error,
      responseTime: 0,
    };
  }
  return result;
};