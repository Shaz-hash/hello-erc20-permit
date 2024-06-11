import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import VerifySignature from '../../blockchain/artifacts/contracts/VerifySignature.sol/VerifySignature.json';
import VerifySignature from 'artifacts/contracts/VerifySignature.sol/VerifySignature.json';
const ethers = require("ethers");


const verifyContractAddress = '0x0B6452a1c483f7804C8BC7a2Fd1DF4d72b478Ab9';


function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);


  useEffect(() => {
    const storedSignature = localStorage.getItem('userSignature');
    if (storedSignature) {
      setIsVerified(true);
    }
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (typeof window.ethereum !== 'undefined') {
      try {
        // Check if VerifySignature is defined and has ABI
        if (typeof VerifySignature === 'undefined' || !VerifySignature.abi) {
          throw new Error('VerifySignature contract ABI is not defined');
        }
  
        const contractABI = VerifySignature.abi;
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(verifyContractAddress, contractABI, signer);
  
        // Create a Signature via ur Private key and save it in variable :

        const myString = username + "," + password;
        const myAccountAddress = await signer.getAddress();
        // const normalizedAddress =  new ethers.utils.getAddress(myAccountAddress);
        const messageHash = await contract.getMessageHash(myString);
        // const mySignature = await signer.signMessage(myString);
        // Sign the message hash using personal_sign
        const mySignature = await window.ethereum.request({
          method: 'personal_sign',
          params: [myAccountAddress, messageHash],
        });
        console.log("My String : ", myString);
        console.log("Account address : ", myAccountAddress)
        console.log("My message hash  : ", messageHash);
        console.log("mySignatyre : ", mySignature);
        const verificationDecision = await contract.verify(myAccountAddress , myString , mySignature);
        console.log("Result of Signature verification is : ", verificationDecision);

        if (verificationDecision) {
          // Save the signature in localStorage
          localStorage.setItem('userSignature', mySignature);
          setIsVerified(true);
          setError(null);
        } else {
          setError('Verification failed. Please try again.');
        }







        //console.log('Message hash:', messageHash);
        // console.log('UserNAME HASH IS : ', transaction);
        setError(null);
      } catch (error) {
        console.error('Error signing up:', error);
        setError('Error signing up. Please try again.');
      }
    } else {
      console.error('window.ethereum is not available');
    }







    // if (typeof window.ethereum !== 'undefined') {
    //   try {
    //     // Check if VerifySignature is defined and has ABI
    //     if (typeof VerifySignature === 'undefined' || !VerifySignature.abi) {
    //       throw new Error('VerifySignature contract ABI is not defined');
    //     }
  
    //     const contractABI = VerifySignature.abi;
    //     await window.ethereum.request({ method: 'eth_requestAccounts' });
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = provider.getSigner();
    //     const contract = new ethers.Contract(verifyContractAddress, contractABI, signer);
  
    //     const transaction = await contract.getMessageHash(username);
    //     await transaction.wait();
    //     console.log('UserNAME HASH IS : ', transaction);
    //     setError(null);
    //   } catch (error) {
    //     console.error('Error signing up:', error);
    //     setError('Error signing up. Please try again.');
    //   }
    // } else {
    //   console.error('window.ethereum is not available');
    // }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (typeof window.ethereum !== 'undefined') {
 
      let contractABI = VerifySignature.abi;
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(verifyContractAddress, contractABI, signer);

      try {
        const user = await contract.getMessageHash(username);;
        console.log('User retrieved:', user);
        setUserInfo({ username: user[0], password: user[1] });
        setError(null);
      } catch (error) {
        console.error('Error retrieving user:', error);
        setError('Error retrieving user details. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {!isVerified && (
        <form onSubmit={handleSignUp}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      )}

      {isVerified && (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {userInfo && (
        <div>
          <h3>User Information</h3>
          <p>Username: {userInfo.username}</p>
          <p>Password: {userInfo.password}</p>
        </div>
      )}
    </div>
  );
}

export default SignUp;
