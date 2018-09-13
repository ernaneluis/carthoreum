const Documents = artifacts.require('Documents.sol')

module.exports = deployer => {
  deployer.deploy(Documents)
  console.log('Documents deployed')
}
