pragma solidity ^0.4.17;

import './Ownable.sol';

contract Documents is Ownable {

    struct Document {
        uint timestamp;
        bytes32 sha3Hash;
        string ipfsHash;
        address[] allowedSigners;
        address[] signatures;
    }

    event AddDocument(uint timestamp, bytes32 indexed sha3Hash, string ipfsHash,  address[] allowedSigners, address[] signatures);

    mapping(bytes32 => Document) public documents;

    function addDocument(bytes32 sha3Hash,  string ipfsHash) public notExistsDocument(sha3Hash) {    
        address[] memory allowedSigners = new address[](1);
        allowedSigners[0] = msg.sender;
        // TODO add signers address as input
        address[] memory signatures = new address[](1);
        signatures[0] = msg.sender;
        documents[sha3Hash] = Document(block.timestamp, sha3Hash, ipfsHash, allowedSigners, signatures);
        emit AddDocument(block.timestamp, sha3Hash, ipfsHash, allowedSigners, signatures);
    }

    function signDocument(bytes32 sha3Hash) public {
        // TODO check if sender can sign document
        documents[sha3Hash].signatures.push(msg.sender);
    }

    function getSignatures(bytes32 sha3Hash) public view returns (address[]) {
        return documents[sha3Hash].signatures;
    }

    function getIpfsHash(bytes32 sha3Hash) public constant returns (string) {
        return documents[sha3Hash].ipfsHash;
    }
   
    function doesDocumentExists(bytes32 sha3Hash) public constant returns (bool) {
        // what is this bytes32(0)
        return documents[sha3Hash].sha3Hash != bytes32(0);
    }

    modifier notExistsDocument(bytes32 sha3Hash) {
        require(!doesDocumentExists(sha3Hash));
        _;
    }

    function getDocument(bytes32 sha3Hash) public constant returns (uint,bytes32,string,address[],address[]) {
        return (documents[sha3Hash].timestamp,
        documents[sha3Hash].sha3Hash,
        documents[sha3Hash].ipfsHash,
        documents[sha3Hash].allowedSigners,
        documents[sha3Hash].signatures);
    }

    // TODO
    // function didSign(bytes32 sha3Hash) constant returns (bool) {
    //     return documents[sha3Hash].signatures[msg.sender] != address();
    // }
}
