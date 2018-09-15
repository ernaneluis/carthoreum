pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Documents is Ownable {

    struct Document {
        uint timestamp;
        bytes32 sha3Hash;
        string ipfsHash;
        address[] allowedSigners;
        address[] signeders;
        mapping(address => bool) signatures;
    }

    event AddDocument(uint timestamp, bytes32 indexed sha3Hash, string ipfsHash,  address[] allowedSigners, address[] signeders);

    mapping(bytes32 => Document) public documents;

    function addDocument(bytes32 sha3Hash,  string ipfsHash) public notExistsDocument(sha3Hash) {    
        address[] memory allowedSigners = new address[](1);
        allowedSigners[0] = msg.sender;
        // TODO add signers address as input
        address[] memory signeders = new address[](1);
        signeders[0] = msg.sender;

        documents[sha3Hash] = Document(now, sha3Hash, ipfsHash, allowedSigners, signeders);
        documents[sha3Hash].signatures[msg.sender] = true;

        emit AddDocument(now, sha3Hash, ipfsHash, allowedSigners, signeders);
    }

    function signDocument(bytes32 sha3Hash) public {
        // TODO check if sender can sign document
        documents[sha3Hash].signatures[msg.sender] = true;
        documents[sha3Hash].signeders.push(msg.sender);
    }

    function doesDocumentExists(bytes32 sha3Hash) public view returns (bool) {
        // what is this bytes32(0)
        return documents[sha3Hash].sha3Hash != bytes32(0);
    }

    modifier notExistsDocument(bytes32 sha3Hash) {
        require(!doesDocumentExists(sha3Hash),  "Document already have been added!");
        _;
    }

    function getDocument(bytes32 sha3Hash) public view returns (uint,bytes32,string,address[],address[]) {
        return (documents[sha3Hash].timestamp,
        documents[sha3Hash].sha3Hash,
        documents[sha3Hash].ipfsHash,
        documents[sha3Hash].allowedSigners,
        documents[sha3Hash].signeders);
    }


    function didSign(bytes32 sha3Hash) public view returns (bool) {
        return documents[sha3Hash].signatures[msg.sender] == true;
    }
}
