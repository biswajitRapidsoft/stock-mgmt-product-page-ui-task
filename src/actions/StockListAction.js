import config from "../config/config";
import { Services } from "../services/Services";

const Stock = async () => {
  const apiEndPoint =
    config.baseUrl + config.apiEndPoints.getDetails + `?companyId=17`;

  const res = await Services.GET(apiEndPoint);
  if (res) {
    return res;
  } else {
    return null;
  }
};

export const StockListAction = { Stock };
