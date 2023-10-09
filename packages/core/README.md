## Future feature

- Support additional and custom chain( building your own chain object that inherits the **AddressMap** type)
- Integration with web3 provider of client side

## Future improvement Changes

- Check the code structure of `useIsHavePendingTransaction` in the file packages/core/src/state/transactions/hooks.ts
- change the structure of `icon folder` definition and usage
- Clean nextjs code
- Remove extra `Debounced` Variables
- Check the `windowVisible` variable in /core/src/state/user/updater.tsx
- ReWrite the `FIXME` tag in project
- Update typescript version
- Remove /src from import package of core in nextjs
- Suggest package path importing in nextjs
- Add previous account code to sdk project
- Review the importing of next in the file of symmio-client/packages/core/src/constants/chainInfo.ts
- We add `"noImplicitAny": false`, to tsconfig.json file. Recheck that this parameter is harmful or not.
- Update packages (e.g. recharts)
- Check `utils/numbers.js` (and some other utils files) client side functions
- Remove `useDebounce` from the code( when its not necessary)
- Double check `BlockNumberProvider`, is it really necessary?
- change the structure of addresses in the repository. should change the `constants/addresses`, `apollo/client/balanceHistory`, `apollo/client/orderHistory` and `constants/hedgers` to class based format
- get the contract addresses as a config from client.
