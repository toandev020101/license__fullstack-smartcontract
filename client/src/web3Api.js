import Web3 from 'web3';
import contractABI from './contracts/abi.json';
const contractAddress = '0xf4f4FC45Cb69Bc32716fc36136B773750fe4A013';

class Web3Api {
  async connect() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Kết nối với MetaMask hoặc trình duyệt có hỗ trợ Web3
      this.web3Instance = new Web3(window.ethereum);
      this.contractInstance = new this.web3Instance.eth.Contract(contractABI, contractAddress);

      return true;
    } catch (error) {
      console.log(error);
      return false;
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
