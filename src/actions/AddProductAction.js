import config from "../config/config";
import { Services } from "../services/Services";

const AddProduct = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.addProduct;
  const res = await Services.POST(apiEndPoint, payload);
  if (res) {
    return res;
  } else {
    return null;
  }
};

export const AddProductAction = { AddProduct };
