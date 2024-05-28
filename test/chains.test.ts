import { expect } from 'chai';
import { SupportType } from 'lib/chains/Chain';
import { ALCHEMY_API_KEY, INFURA_API_KEY } from 'lib/constants';
import {
  ORDERED_CHAINS,
  createViemPublicClientForChain,
  getChainApiUrl,
  getChainConfig,
  getChainExplorerUrl,
  getChainFreeRpcUrl,
  getChainIdFromSlug,
  getChainInfoUrl,
  getChainLogo,
  getChainLogsRpcUrl,
  getChainName,
  getChainNativeToken,
  getChainRpcUrl,
  getChainSlug,
  getCorrespondingMainnetChainId,
} from 'lib/utils/chains';
import networkDescriptions from 'locales/en/networks.json';

describe('Chain Support', () => {
  ORDERED_CHAINS.forEach((chainId) => {
    const chainName = getChainName(chainId);

    describe(chainName, () => {
      it('should have base chain data', () => {
        expect(getChainName(chainId)).to.exist;
        expect(getChainLogo(chainId)).to.exist;
        expect(getChainInfoUrl(chainId)).to.exist;
        expect(getChainExplorerUrl(chainId)).to.exist;
        expect(getChainRpcUrl(chainId)).to.exist;
        expect(getChainLogsRpcUrl(chainId)).to.exist;
        expect(getChainFreeRpcUrl(chainId)).to.exist;
        expect(getChainNativeToken(chainId)).to.exist;
        expect(getChainSlug(chainId)).to.exist;
        expect(getChainIdFromSlug(getChainSlug(chainId))).to.equal(chainId);
      });

      if (getChainConfig(chainId)?.type === SupportType.ETHERSCAN_COMPATIBLE) {
        it('should have an Etherscan API URL', () => {
          expect(getChainApiUrl(chainId)).to.exist;
        });
      }

      it('should have a description', () => {
        const mainnetChainId = getCorrespondingMainnetChainId(chainId) ?? chainId;
        expect(networkDescriptions.networks[getChainSlug(mainnetChainId)]).to.exist;
      });

      it('should have the correct chain ID for the main RPC', async () => {
        const client = createViemPublicClientForChain(chainId, getChainRpcUrl(chainId));
        expect(await client.getChainId()).to.equal(chainId);
      });

      if (getChainRpcUrl(chainId) !== getChainLogsRpcUrl(chainId)) {
        it('should have the correct chain ID for the logs RPC', async () => {
          const client = createViemPublicClientForChain(chainId, getChainLogsRpcUrl(chainId));
          expect(await client.getChainId()).to.equal(chainId);
        });
      }

      if (getChainRpcUrl(chainId) !== getChainFreeRpcUrl(chainId)) {
        it('should have the correct chain ID for the free RPC', async () => {
          const client = createViemPublicClientForChain(chainId, getChainFreeRpcUrl(chainId));
          expect(await client.getChainId()).to.equal(chainId);
        });
      }

      it('should not expose API keys in the free RPC URL', () => {
        INFURA_API_KEY && expect(getChainFreeRpcUrl(chainId)).to.not.include(INFURA_API_KEY);
        ALCHEMY_API_KEY && expect(getChainFreeRpcUrl(chainId)).to.not.include(ALCHEMY_API_KEY);
      });
    });
  });
});

export {};
