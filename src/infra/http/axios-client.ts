import { HttpGetClient } from "@/infra/http";

import axios from "axios";

export class AxiosHttpClient implements HttpGetClient {
  async get<T = any>(arga: HttpGetClient.Params): Promise<T> {
    const { data } = await axios.get(arga.url, {params: arga.params})
    return data;
  }
}
