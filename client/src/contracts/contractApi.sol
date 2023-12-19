//// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract contractApi{
    struct License {
        uint256 id;
        string hash;
    }

    mapping (uint256 => License) licenses;

    License[] public licenseArr;
    address owner;
    uint256 public licenseAmount = 100000;

    constructor(){
        owner = msg.sender;
    }

    function getPayment() public view returns(address, uint256){
        return (owner, licenseAmount);
    }

    function getLicenses(uint256[] memory _ids) public returns(License[] memory){
        for(uint256 i; i < _ids.length; i++){
            licenseArr.push(licenses[_ids[i]]);
        }

        return licenseArr;
    }

    function getLicense(uint256 _id) public view returns(License memory){
        return licenses[_id];
    }

    function createLicense(uint256 _id, string memory _hash) public {
        licenses[_id] = License(_id, _hash);
    }

    function updateLicense(uint256 _id, string memory _hash) public {
        licenses[_id].hash = _hash;
    }

    function removeLicense(uint256 _id) public {
        delete licenses[_id];
    }

    function removeLicenses(uint256[] memory _ids) public {
        for(uint256 i; i < _ids.length; i++){
            delete licenses[_ids[i]];
        }
    }
}