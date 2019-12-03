const xml2js = require('xml2js');
const axios = require('axios');
const multipartRawParser = require('multipart-raw-parser/build/parse');

const username = process.env.JAGGAER_AUTH_USERNAME;
const password = process.env.JAGGAER_AUTH_PASSWORD;

const parser = new xml2js.Parser({
  attrkey: '$'
});

const headers = {
  'Content-Type': 'text/xml;charset=UTF-8',
  Authorization: `Basic ${Buffer.from(username + ':' + password).toString(
    'base64'
  )}`
};

const baseUrl =
  'https://crowncommercialservice-ws01-prep.bravosolution.co.uk/esop/common-host/services';

let tenders = [
  {
    tender: {
      id: 1
    }
  },
  {
    tender: {
      id: 2
    }
  },
  {
    tender: {
      id: 3
    }
  },
  {
    tender: {
      id: 4
    }
  },
  {
    tender: {
      id: 5
    }
  }
];

exports.createITT = async (event, context, callback) => {
  try {
    logEvent(event);

    // Project Request
    let url = baseUrl + '/Project';

    const { reference, subject } = JSON.parse(event.body);

    const builder = new xml2js.Builder();

    const projectXml = builder.buildObject({
      'soapenv:Envelope': {
        $: {
          'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
          'xmlns:proj': 'http://host.bs.com/common/webservice/Project/',
          'xmlns:xm': 'http://www.w3.org/2005/05/xmlmime'
        },
        'soapenv:Header': {},
        'soapenv:Body': {
          'proj:importProjectRequestMSG': {
            operationCode: 'CREATE',
            project: {
              tender: {
                title: `${reference} - ${subject}`,
                buyerCompany: {
                  id: 51435
                },
                projectType: 'CCS_PROJ'
              }
            }
          }
        }
      }
    });

    const projResponse = await axios.default.post(url, projectXml, {
      headers
    });

    const projResponseData = projResponse.data;

    const projMultipartDataArray = multipartRawParser.parse(
      projResponseData,
      projResponse.headers['content-type']
    );

    const projJson = parseXMLAsJson(projMultipartDataArray[1].value);

    // Rfx Request
    url = baseUrl + '/Rfx';

    const rfxXml = builder.buildObject({
      'soapenv:Envelope': {
        $: {
          'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
          'xmlns:rfx': 'http://host.bs.com/common/webservice/Rfx',
          'xmlns:xm': 'http://www.w3.org/2005/05/xmlmime'
        },
        'soapenv:Header': {},
        'soapenv:Body': {
          'rfx:importRfxRequestMsg': {
            operationCode: 'CREATE',
            rfx: {
              rfxSetting: {
                rfiFlag: 0,
                shortDescription: subject,
                buyerCompany: {
                  id: 51435
                },
                rfxType: 'STANDARD_ITT',
                autoCreateTender: 1
              }
            }
          }
        }
      }
    });

    const rfxResponse = await axios.default.post(url, rfxXml, {
      headers
    });

    const rfxResponseData = rfxResponse.data;

    const rfxMultipartDataArray = multipartRawParser.parse(
      rfxResponseData,
      rfxResponse.headers['content-type']
    );

    const rfxJson = parseXMLAsJson(rfxMultipartDataArray[1].value);

    const projMsgObj = getResponseMsg(projJson);
    const rfxMsgObj = getResponseMsg(rfxJson);

    callback(
      null,
      buildResponse(201, {
        projectCode: projMsgObj.tenderReferenceCode[0],
        ittCode: rfxMsgObj.rfxReferenceCode[0]
      })
    );
  } catch (error) {
    callback(error.message);
  }
};

exports.getTenderStatuses = async (event, context, callback) => {
  try {
    callback(
      null,
      buildResponse(200, {
        additionalProp1: 0,
        additionalProp2: 0,
        additionalProp3: 0
      })
    );
  } catch (error) {
    callback(error.message);
  }
};

exports.getTenders = async (event, context, callback) => {
  try {
    logEvent(event);

    const response =
      event.pathParameters && event.pathParameters.id
        ? getTenderById(+event.pathParameters.id)
        : getAllTenders();

    callback(null, buildResponse(200, response));
  } catch (error) {
    callback(error.message);
  }
};

exports.deleteTender = async (event, context, callback) => {
  try {
    logEvent(event);

    if (event.pathParameters && event.pathParameters.id)
      callback(null, deleteTender(+event.pathParameters.id));
  } catch (error) {
    callback(error.message);
  }
};

const getAllTenders = () => {
  return { tenders };
};

const getTenderById = id => {
  if (!Number.isInteger(id)) return Error('Invalid ID supplied');

  return {
    id,
    description: 'Tender - Laptops for Schools',
    status: 'Invitation to Tender'
  };
};

const deleteTender = id => {
  if (!Number.isInteger(id)) return Error('Invalid ID supplied');

  return buildResponse(204);
};

const buildResponse = (
  statusCode,
  body = {},
  stringifyBody = true,
  headers = {
    'Access-Control-Allow-Origin': '*'
  }
) => {
  if (stringifyBody) body = JSON.stringify(body);

  return {
    statusCode,
    body,
    headers
  };
};

const logEvent = event => {
  console.log('Received event:', JSON.stringify(event, null, 2));
};

const parseXMLAsJson = xml => {
  let response;

  parser.parseString(xml, (error, result) => {
    if (!error) {
      response = result;
    } else {
      response = Error(error.message);
    }
  });

  return response;
};

const getResponseMsg = soap => {
  // Iterate through keys finding the required response
  const soapEnvelope = soap[Object.keys(soap)[0]];
  const soapBody = soapEnvelope[Object.keys(soapEnvelope)[1]];
  const soapResponseArray = soapBody[Object.keys(soapBody)[0]];

  return soapResponseArray[Object.keys(soapResponseArray)[0]][0];
};
