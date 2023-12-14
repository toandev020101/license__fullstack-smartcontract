import Web3 from 'web3';

class Web3Api {
  async connect() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Kết nối với MetaMask hoặc trình duyệt có hỗ trợ Web3
      this.web3Instance = new Web3(window.ethereum);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async sign({ publicAddress, nonce }) {
    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [this.web3Instance.utils.utf8ToHex(`Tôi đang ký một lần nonce của mình: ${nonce}`), publicAddress],
      });

      return signature;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static getInstance() {
    if (!Web3Api.instance) {
      Web3Api.instance = new Web3Api();
    }

    return Web3Api.instance;
  }
}

export default Web3Api;
