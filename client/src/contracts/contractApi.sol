//// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract contractApi{
    struct License {
        uint256 id;
        string hash;
    }

    // struct History{
    //     uint256 id;
    //     string hash;
    // }

    mapping (uint256 => License) licenses;
    // mapping (uint256 => History) histories;

    License[] public licenseArr ;

    function getLicenses(uint256[] memory ids) public returns(License[] memory){
        for(uint256 i; i < ids.length; i++){
            licenseArr.push(licenses[ids[i]]);
        }

        return licenseArr;
    }

    function createLicense(uint256 _id, string memory _hash) public{
        licenses[_id] = License(_id, _hash);
    }
}