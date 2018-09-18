pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Documents is Ownable {

    /*
     *  Constants
    */
    uint constant public MAX_ALLOWED_SIGNERS_COUNT = 10;

    struct Document {
        uint timestamp;

        // hash sha3 of the not-encrypted-original-file
        bytes32 sha3Hash;

        // ipfs hash of the encrypted file encrypted with secret  S 
        string encryptedIpfsHash; 
        
        address[] allowedSigners;
        
        address[] signatures;
        
        // serialized json array containing the secret S encrypted with each public key from allowedSigners
        // {publicKey A:secretS encrypted with public key A, publicKey B: secret S encrypted with public key B, ...}
        string encryptedSecrets; 

        // serialized json array containing the emails of each participan from allowedSigners,  encrypted with secret S
        // encrypt(S, JSON.stringify({publicKey A:emailA, publicKey B: email B, ...}))
        string encryptedEmails; 

        mapping(address => bool) canSign;

        mapping(address => bool) didSign;
    }

    mapping(bytes32 => Document) public documents;
    uint public totalDocuments;


    event CreateDocument(uint timestamp, bytes32 indexed sha3Hash,  address[] allowedSigners);
    event DidSignDocument(uint timestamp, bytes32 indexed sha3Hash, address signer);
    
    function createDocument(
        bytes32 _sha3Hash,  
        string _encryptedIpfsHash, 
        address[] _allowedSigners, 
        string _encryptedSecrets,
        string _encryptedEmails
        ) public notExistsDocument(_sha3Hash) {    
        require(_allowedSigners.length <= MAX_ALLOWED_SIGNERS_COUNT, "Maximum 10 signers");

        address[] memory signatures = new address[](1);
       
        documents[_sha3Hash] = Document(now, _sha3Hash, _encryptedIpfsHash, _allowedSigners, signatures, _encryptedSecrets, _encryptedEmails);

        for (uint i = 0; i < _allowedSigners.length; i++) {
            require(!documents[_sha3Hash].canSign[_allowedSigners[i]] && _allowedSigners[i] != 0, "Allowed Signers cannt be empty/null");
            documents[_sha3Hash].canSign[_allowedSigners[i]] = true;
        }

        emit CreateDocument(now, _sha3Hash, _allowedSigners);
        totalDocuments++;
    }

    function signDocument(bytes32 sha3Hash) public canSignDocument(sha3Hash) {
        documents[sha3Hash].didSign[msg.sender] = true;
        documents[sha3Hash].signatures.push(msg.sender);
        emit DidSignDocument(now, sha3Hash, msg.sender);
    }

    function doesDocumentExists(bytes32 sha3Hash) public view returns (bool) {
        return documents[sha3Hash].sha3Hash != bytes32(0);
    }


    function getDocument(bytes32 sha3Hash) public view returns (uint, bytes32, string, address[], address[], string, string) {
        return (documents[sha3Hash].timestamp,
        documents[sha3Hash].sha3Hash,
        documents[sha3Hash].encryptedIpfsHash,
        documents[sha3Hash].allowedSigners,
        documents[sha3Hash].signatures,
        documents[sha3Hash].encryptedSecrets,
        documents[sha3Hash].encryptedEmails);
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
