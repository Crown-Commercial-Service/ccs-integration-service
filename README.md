# CCS Integration Service
Welcome to the Crown Commercial Service Integration Repository.  In here you will find:

 - The Crown Commercial Service API Source code, linked to the [CCS API Editor in SwaggerHub](https://app.swaggerhub.com/apis/timothygalvin-ccs/crown-commercial-service/v0_3)
 - Guidance on developing APIs in CCS
 - Overview of Integration Standards in CCS
 - links to lower-level designs underpinning API and related development
 - information about the CCS Integration Factory and the API delivery team
 
The CCS API implementation depends on a number of [CCS Platform Services](/Crown-Commercial-Service/ccs-platform-services)

## Developing APIs
1. We use [Swagger](swaggerhub.io) to create the API specs in YAML.
1. the Core CCS team uses SoapUI for testing and creating mock servers
1. CCS takes an API First approach, which means:
    + create the spec first in the [editor](https://app.swaggerhub.com/apis/timothygalvin-ccs/crown-commercial-service/v0_3)
    + developers build directly against the spec, to quickly get working software 
    + relies heavily on mocked services and a range of test data
    + integrates with an API portal to public documentation directly from the spec
4. fits with the CCS engineering method.  An initial API version should be created prior to any sprint so that developers can start coding immediately 

## Testing APIs

Testing Contexts and Environments:
 - link to dev env
 
### Testing Method
 - swagger automock
 - standalone (portable) mock service via SoapUI
 - manual - postman or soap UI
 - End-to-End => initialisation!!

## API Development Standards
Guidance on API development is underpinned by two key documents
 - API Policy ***link to repo
 - versioning ***
 
Summary of key standards:
 - Use OpenAPI 3.0 where possible ([GDS guidance](https://www.gov.uk/guidance/gds-api-technical-and-data-standards))
 - URI of the API adheres to this format: https://<context.>api.crowncommercialservice.gov.uk/<service> ([CCS API Naming Standard](https://drive.google.com/open?id=1n5oCa2GucNFSRCK3gSIpC9PAlqkGoQUrEXFYxrQEzsw))
 - Manage API versions through a content type in the request header ([CCS API Naming Standard](https://drive.google.com/open?id=1n5oCa2GucNFSRCK3gSIpC9PAlqkGoQUrEXFYxrQEzsw))
 - Use [Schemas](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schemaObject) to define data with an API.  Schemas trace back to Logical objects in the [CCS Data Architecture](https://drive.google.com/open?id=1pRqKBBWuxwEaryKZ7qDEUf0rG0vRVIcW)  
 
 
