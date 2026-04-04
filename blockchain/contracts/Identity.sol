// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Identity {
    struct Tourist {
        bool isVerified;
        uint256 trustScore;
        string name;
        uint256 lastVerifiedAt;
    }

    mapping(address => Tourist) public tourists;
    address public authority;

    event Verified(address indexed tourist, string name);
    event TrustScoreUpdated(address indexed tourist, uint256 newScore);

    modifier onlyAuthority() {
        require(msg.sender == authority, "Only authority can perform this action");
        _;
    }

    constructor() {
        authority = msg.sender;
    }

    function verifyTourist(address _tourist, string memory _name) public onlyAuthority {
        tourists[_tourist] = Tourist({
            isVerified: true,
            trustScore: 100,
            name: _name,
            lastVerifiedAt: block.timestamp
        });
        emit Verified(_tourist, _name);
    }

    function updateTrustScore(address _tourist, uint256 _newScore) public onlyAuthority {
        require(tourists[_tourist].isVerified, "Tourist not verified");
        tourists[_tourist].trustScore = _newScore;
        emit TrustScoreUpdated(_tourist, _newScore);
    }

    function getTourist(address _tourist) public view returns (bool, uint256, string memory) {
        Tourist memory t = tourists[_tourist];
        return (t.isVerified, t.trustScore, t.name);
    }
}
