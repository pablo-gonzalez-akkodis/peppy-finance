## Future feature

- Support additional and custom chain( building your own chain object that inherits the **AddressMap** type)
- Integration with web3 provider of client side

## Future improvement Changes

- change the structure of `icon folder` definition and usage
- Clean nextjs code
- Add previous account code to sdk project
- Update packages (e.g. recharts)
- Check `utils/numbers.js` (and some other utils files) client side functions
- Double check `BlockNumberProvider`, is it really necessary?
- change the structure of addresses in the repository. should change the `constants/addresses`, `apollo/client/balanceHistory`, `apollo/client/orderHistory` and `constants/hedgers` to class based format
- get the contract addresses as a config from client.
- resolve bug: when speedup pending transaction cause change the hash of transaction and cause error in site
- resolve all error in console
- use wagmi multicall
- redesign the structure of checking pending transactions and use watch transaction wagmi
- remove commented code in project
- remove environment variable from sdk code. should get this param from client. search `process.env.` in packages directory
- remove `any` type in sdk
- remove `console.log` from sdk
- restructure the hedging address and get addresses from client
- change the name of project from "symm-client" to 'symmio-frontend-sdk'
