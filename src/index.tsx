import * as React from 'react'

export const load = (environment: 'prod' | 'sandbox'): Promise<void> =>
  new Promise((resolve: () => void): void => {
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src =
      environment === 'prod'
        ? 'https://cdn.dwolla.com/1/dwolla.min.js'
        : 'https://cdn.dwolla.com/1/dwolla.js'

    s.addEventListener('load', (): void => {
      window.dwolla.configure(environment)
      resolve()
    })

    document.body.appendChild(s)
  })

type DwollaIAVError = {
  code: string
  message: string
}

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
  } catch {
    return ''
  }
}

const containerId = '__react-dwolla-iav-container'

type DwollaProps = {
  testID?: string
  onSuccess: (string) => void
  onError: (string) => void
  dwollaConfig: {
    backButton?: boolean
    customerToken: string
    environment: 'prod' | 'sandbox'
    fallbackToMicroDeposits?: boolean
    microDeposits?: boolean
    stylesheets?: string[]
    subscriber: (mixed) => void
  }
}

export default class Dwolla extends React.Component<DwollaProps, unknown> {
  componentDidMount(): void {
    const {
      dwollaConfig: { environment, customerToken },
      dwollaConfig,
    } = this.props

    load(environment)
      .then((): void => {
        // @ts-ignore
        window.dwolla.iav.start(
          customerToken,
          { ...dwollaConfig, container: containerId },
          (err: DwollaIAVError, res: DwollaIAVResponse): void => {
            if (err) {
              this.props.onError(err.message || err.code)
            } else {
              this.props.onSuccess(pluckFundingSource(res))
            }
          }
        )
      })
      .catch((e: string): void => {
        this.props.onError(e)
      })
  }

  render() {
    return (
      <div
        id={containerId}
        data-testid={this.props.testID || '__react-dwolla-iav'}
      />
    )
  }
}
