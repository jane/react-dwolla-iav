// @flow

import * as React from 'react'

export const load = (environment: 'prod' | 'sandbox'): Promise<void> =>
  new Promise(
    (resolve): void => {
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.async = true
      s.src = environment === 'prod'
        ? 'https://cdn.dwolla.com/1/dwolla.min.js'
        : 'https://cdn.dwolla.com/1/dwolla.js'

      s.addEventListener(
        'load',
        (): void => {
          window.dwolla.configure(environment)
        }
      )
      // $FlowFixMe
      document.body.appendChild(s)
      resolve()
    }
  )

type DwollaIAVResponse = {
  _links: {
    'funding-source': {
      href: string
    }
  }
}

const pluckFundingSource = (res: DwollaIAVResponse): string => {
  try {
    const href = res._links['funding-source'].href.split('/')
    return href[href.length - 1]
  } catch (_) {
    return ''
  }
}

const containerId = 'react-dwolla-iav-container'

type DwollaProps = {
  onSuccess: (string) => void,
  onError: (Error) => void,
  dwollaConfig: {
    backButton?: bool,
    customerToken: string,
    environment: 'prod' | 'sandbox',
    fallbackToMicroDeposits?: bool,
    microDeposits?: bool,
    stylesheets?: string[],
    subscriber: (mixed) => void
  }
}

export default class Dwolla extends React.Component<DwollaProps, {}> {
  async componentDidMount () {
    try {
      const { dwollaConfig: { environment, customerToken }, dwollaConfig } =  this.props
      await load(environment)
      window.dwolla.iav.start(
        customerToken,
        { ...dwollaConfig, container: containerId },
        (err: Error, res: DwollaIAVResponse) => {
          if (err) throw err
          this.props.onSuccess(pluckFundingSource(res))
        }
      )
    } catch (e) {
      this.props.onError(e)
    }
  }

  render () {
    return <div id={containerId} />
  }
}
