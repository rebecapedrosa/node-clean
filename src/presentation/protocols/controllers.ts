import { httpResponse, httpRequest } from '../protocols/http'

export interface Controller{
  handle: (httpRequest: httpRequest) => httpResponse

}
