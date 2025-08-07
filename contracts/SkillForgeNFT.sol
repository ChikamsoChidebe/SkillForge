// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SkillForgeNFT {
    struct Badge {
        string name;
        string description;
        uint256 milestone;
        string rarity;
        uint256 timestamp;
        string metadataURI;
    }

    struct LearningRecord {
        address learner;
        string title;
        string description;
        string category;
        uint256 timestamp;
        bool verified;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(address => uint256) public userEntryCount;
    mapping(address => LearningRecord[]) public learningRecords;
    mapping(address => bool) public verifiedEducators;

    uint256 private _tokenIds;
    address public owner;

    event BadgeMinted(address indexed learner, uint256 tokenId, string badgeName);
    event LearningRecorded(address indexed learner, string title, uint256 timestamp);
    event EducatorVerified(address indexed educator);

    constructor() {
        owner = msg.sender;
    }

    function recordLearning(
        string memory title,
        string memory description,
        string memory category
    ) public {
        learningRecords[msg.sender].push(LearningRecord({
            learner: msg.sender,
            title: title,
            description: description,
            category: category,
            timestamp: block.timestamp,
            verified: false
        }));
        
        userEntryCount[msg.sender]++;
        _checkAndMintBadges(msg.sender);
        
        emit LearningRecorded(msg.sender, title, block.timestamp);
    }

    function _checkAndMintBadges(address learner) internal {
        uint256 entryCount = userEntryCount[learner];
        
        if (entryCount == 1) {
            _mintBadge(learner, "First Steps", "Recorded your first learning milestone", 1, "common");
        } else if (entryCount == 5) {
            _mintBadge(learner, "Learning Streak", "Completed 5 learning milestones", 5, "uncommon");
        } else if (entryCount == 10) {
            _mintBadge(learner, "Knowledge Builder", "Reached 10 learning milestones", 10, "rare");
        } else if (entryCount == 20) {
            _mintBadge(learner, "Learning Master", "Achieved 20 learning milestones", 20, "legendary");
        } else if (entryCount == 50) {
            _mintBadge(learner, "Dedicated Learner", "Completed 50 learning milestones", 50, "legendary");
        } else if (entryCount == 100) {
            _mintBadge(learner, "Learning Legend", "Reached 100 learning milestones", 100, "legendary");
        }
    }

    function _mintBadge(
        address learner,
        string memory name,
        string memory description,
        uint256 milestone,
        string memory rarity
    ) internal {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        badges[newTokenId] = Badge({
            name: name,
            description: description,
            milestone: milestone,
            rarity: rarity,
            timestamp: block.timestamp,
            metadataURI: ""
        });
        
        userBadges[learner].push(newTokenId);
        emit BadgeMinted(learner, newTokenId, name);
    }

    function verifyEducator(address educator) public {
        require(msg.sender == owner, "Only owner can verify educators");
        verifiedEducators[educator] = true;
        emit EducatorVerified(educator);
    }

    function getUserBadges(address user) public view returns (uint256[] memory) {
        return userBadges[user];
    }

    function getLearningRecords(address learner) public view returns (LearningRecord[] memory) {
        return learningRecords[learner];
    }
}