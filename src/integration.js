const xml2js = require('xml2js');
const parser = new xml2js.Parser({
  attrkey: '$'
});
const soapRequest = require('easy-soap-request');

const username = process.env.JAGGAER_AUTH_USERNAME;
const password = process.env.JAGGAER_AUTH_PASSWORD;

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

exports.createITT = async (event, context) => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Project Request
    let url = baseUrl + '/Project';

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
                title: 'Test Project 123',
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

    const projectResponseBody = await makeJaggaerRequest(
      projectXml,
      url,
      headers
    );

    // const projJson = projectResponseBody.response.body;
    const projJson = parseXMLAsJson(projectResponseBody.response.body)[
      'soapenv:Envelope'
    ]['soapenv:Body'][0]['ns1:importProjectResponseMSG'][0];

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
                shortDescription: 'ITT Short Description',
                longDescription: 'ITT Long Description',
                buyerCompany: {
                  id: 51435
                },
                value: 150000,
                valueCurrency: 'GBP',
                bidsCurrency: 'GBP',
                qualEnvStatus: 0,
                techEnvStatus: 0,
                commEnvStatus: 1,
                rfxType: 'STANDARD_ITT',
                autoCreateTender: 1
              }
            }
          }
        }
      }
    });

    const rfxResponseBody = await makeJaggaerRequest(rfxXml, url, headers);
    const rfxJson = parseXMLAsJson(rfxResponseBody.response.body)[
      'soapenv:Envelope'
    ]['soapenv:Body'][0]['ns1:importRfxResponseMsg'][0];

    // Return response
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },

      body: {
        projectCode: projJson.tenderReferenceCode[0],
        ittCode: rfxJson.rfxReferenceCode[0]
      },
      statusCode: 200
    };

    console.log(response);

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.getTenderStatuses = async (event, context) => {
  try {
    return buildResponse(200, {
      additionalProp1: 0,
      additionalProp2: 0,
      additionalProp3: 0
    });
  } catch (err) {
    return buildResponse(401, {
      message: err.message
    });
  }
};

exports.getTenders = async (event, context) => {
  try {
    logEvent(event);

    return event.pathParameters && event.pathParameters.id
      ? getTenderById(parseInt(event.pathParameters.id))
      : getAllTenders();
  } catch (err) {
    return buildResponse(401, {
      message: err.message
    });
  }
};

exports.deleteTender = async (event, context) => {
  try {
    logEvent(event);

    if (event.pathParameters && event.pathParameters.id)
      return deleteTender(parseInt(event.pathParameters.id));

    return buildResponse(204);
  } catch (err) {
    return buildResponse(401, {
      message: err.message
    });
  }
};

const getAllTenders = () => {
  return buildResponse(200, tenders);
};

const getTenderById = id => {
  if (!Number.isInteger(id))
    return buildResponse(400, { message: 'Invalid ID supplied' });

  return buildResponse(200, {
    id,
    description: 'Tender - Laptops for Schools',
    status: 'Invitation to Tender'
  });
};

const deleteTender = id => {
  if (!Number.isInteger(id))
    return buildResponse(400, { message: 'Invalid ID supplied' });

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

async function makeJaggaerRequest(xml, url, headers, timeout = 10000) {
  return await soapRequest({
    url,
    headers,
    xml,
    timeout
  });
}

function parseXMLAsJson(
  xml,
  startPattern = '<soapenv:Envelope',
  endPattern = '</soapenv:Envelope>'
) {
  const trimmedXml = xml
    .substring(
      xml.indexOf(startPattern),
      xml.indexOf(endPattern) + endPattern.length
    )
    .trim();
  let json;

  parser.parseString(trimmedXml, (error, result) => {
    if (!error) {
      json = result;
    } else {
      console.error(error);
      json = error;
    }
  });

  return json;
}
