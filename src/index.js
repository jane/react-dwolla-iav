import * as React from 'react'
import {
  arrayOf,
  bool,
  func,
  oneOf,
  shape,
  string,
} from 'prop-types'

export const load = (environment) =>
  new Promise(
    (resolve) => {
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.async = true
      s.src = environment === 'prod'
        ? 'https://cdn.dwolla.com/1/dwolla.min.js'
        : 'https://cdn.dwolla.com/1/dwolla.js'
      s.addEventListener(
        'load',
        () => {
          window.dwolla.configure(environment)
        }
      )
      document.body.appendChild(s)
      resolve()
    }
  )

export default class Dwolla extends React.Component {
  static propTypes = {
    onSuccess: func.isRequired,
    onError: func.isRequired,
    dwollaConfig: shape({
      backButton: bool,
      container: string.isRequired,
      customerToken: string.isRequired,
      environment: oneOf([ 'prod', 'sandbox' ]).isRequired,
      fallbackToMicroDeposits: bool,
      microDeposits: bool,
      stylesheets: arrayOf(string),
      subscriber: func
    })
  }

  async componentDidMount () {
    try {
      const { customerToken, dwollaConfig: { environment }, dwollaConfig } =  this.props
      await load(environment)
      window.dwolla.iav.start(customerToken, dwollaConfig, (err, res) => {
        if (err) throw err
        this.props.onSuccess(res)
      })
    } catch (e) {
      this.props.onError(e)
    }
  }

  render () {
    return <div id={this.props.dwollaConfig.container} />
  }
}
