pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Documents is Ownable {

    event DebugBool(bool varBool);

    /*
     *  Constants
    */
    uint constant public MAX_ALLOWED_SIGNERS_COUNT = 10;

    // TODO add all the missing data to struct
    struct Document {
        uint timestamp;
        bytes32 sha3Hash;
        string ipfsHash;
        address[] allowedSigners;
        address[] signatures;
        mapping(address => bool) canSign;
        mapping(address => bool) didSign;
    }

    mapping(bytes32 => Document) public documents;
    uint public totalDocuments;


    event CreateDocument(uint timestamp, bytes32 indexed sha3Hash, string ipfsHash, address[] allowedSigners);
    event DidSignDocument(uint timestamp, bytes32 indexed sha3Hash, address signer);
    

    

    function createDocument(address[] _allowedSigners, bytes32 sha3Hash,  string ipfsHash) public notExistsDocument(sha3Hash) {    
        require(_allowedSigners.length <= MAX_ALLOWED_SIGNERS_COUNT, "Maximum 10 signers");

        address[] memory signatures = new address[](1);
       
        documents[sha3Hash] = Document(now, sha3Hash, ipfsHash, _allowedSigners, signatures);

        for (uint i = 0; i < _allowedSigners.length; i++) {
            require(!documents[sha3Hash].canSign[_allowedSigners[i]] && _allowedSigners[i] != 0, "Allowed Signers cannt be empty/null");
            documents[sha3Hash].canSign[_allowedSigners[i]] = true;
        }

        emit CreateDocument(now, sha3Hash, ipfsHash, _allowedSigners);
        totalDocuments++;
    }

    function signDocument(bytes32 sha3Hash) public canSignDocument(sha3Hash) {
        documents[sha3Hash].didSign[msg.sender] = true;
        documents[sha3Hash].signatures.push(msg.sender);
        emit DidSignDocument(now, sha3Hash, msg.sender);
    }

    function doesDocumentExists(bytes32 sha3Hash) public view returns (bool) {
        // what is this bytes32(0)
        return documents[sha3Hash].sha3Hash != bytes32(0);
    }


    function getDocument(bytes32 sha3Hash) public view returns (uint,bytes32,string,address[],address[]) {
        return (documents[sha3Hash].timestamp,
        documents[sha3Hash].sha3Hash,
        documents[sha3Hash].ipfsHash,
        documents[sha3Hash].allowedSigners,
        documents[sha3Hash].signatures);
    }


    function didSignDocument(bytes32 sha3Hash) public view returns (bool) {
        return documents[sha3Hash].didSign[msg.sender] == true;
    }

    modifier notExistsDocument(bytes32 sha3Hash) {
        require(!doesDocumentExists(sha3Hash),  "Document already have been added!");
        _;
    }

    modifier canSignDocument(bytes32 sha3Hash) {
        require(documents[sha3Hash].canSign[msg.sender],  "Address is not allowed to sign this document");
        _;
    }
}
