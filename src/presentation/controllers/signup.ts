import { httpRequest, httpResponse } from '../protocols/http'
import { BadRequest, serverError } from '../helpers/http-helper'

import { Controller, EmailValidator } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'

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
      return serverError()
    }
  }
}
