# symmio-client

## An SDK to interact with SYMMIO contracts, hedgers and peripherals.

- To enable path completion suggestions in VSCode, first build the project by running yarn build. Then, in the VSCode settings, ensure that "TypeScript > Tsc: Auto Detect" is set to 'on'.

- Be sure not to use the publicProvider from Wagmi, as it causes some errors in the SDK. [Wagmi Website](https://wagmi.sh/core/getting-started#configure-chains):
  > Note: In a production app, it is not recommended to only pass publicProvider to configureChains as you will probably face rate-limiting on the public provider endpoints. It is recommended to also pass an alchemyProvider or infuraProvider as well.
