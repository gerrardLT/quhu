export default async function connectWallet (){
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        return {
          address: accounts && accounts.length > 0 ? (accounts[0]) : null,
        };
      } else {
        throw new Error("No Ethereum Wallet");
      }
    } catch (error) {
      console.log(error);
      return { address: null };
    }
  }
  