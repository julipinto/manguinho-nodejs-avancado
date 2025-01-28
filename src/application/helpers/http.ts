import { ServerError } from "@/application/errors"

export interface HttpResponse {
  statusCode: number,
  data: any
}

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  data: error
})
