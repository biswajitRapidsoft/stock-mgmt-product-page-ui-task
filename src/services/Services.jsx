import axios from "axios";
const POST = async (apiEndPoint, payload, params = {}) => {
  try {
    const res = await axios.post(apiEndPoint, payload, {
      params: {
        ...params,
      },
    });
    if (res) {
      return res;
    } else {
      return null;
    }
  } catch (error) {
    return error?.response;
  }
};

const GET = async (apiEndPoint, params = {}) => {
  try {
    const res = await axios.get(apiEndPoint, {
      params: {
        ...params,
      },
    });
    if (res) {
      return res;
    } else {
      return null;
    }
  } catch (error) {
    return error?.response;
  }
};

export const Services = {
  POST,
  GET,
};
