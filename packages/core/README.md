## Future feature

- Support additional and custom chain( building your own chain object that inherits the **AddressMap** type)
- Integration with web3 provider of client side

## Future improvement Changes

- change the structure of `icon folder` definition and usage
- Clean nextjs code
- Add previous account code to sdk project
- Update packages (e.g. recharts)
- Check `utils/numbers.js` (and some other utils files) client side functions
- resolve bug: when speedup pending transaction cause change the hash of transaction and cause error in site
- redesign the structure of checking pending transactions and use watch transaction wagmi
- remove commented code in project
- remove environment variable from sdk code. should get this param from client. search `process.env.` in packages directory
- resolve all error in console
- remove `any` type in sdk
- remove `console.log` from sdk
- restructure the hedging address and get addresses from client
- change the name of project from "symm-client" to 'symmio-frontend-sdk'
- refactor deposit/withdraw modal( use different modal. now use same component)
- checking project license with managers
- talking about server for rpc forward to hidden apikey
