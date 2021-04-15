import { httpRequest, httpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { BadRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controllers'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'
import { ServerError } from '../errors/server-error'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: httpRequest): httpResponse {
    try {
      const requiredField = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isValid) {
        return BadRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
