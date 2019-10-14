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
    logEvent(event);

    return buildResponse(201, {
      message: 'Invitation to tender created successfully.'
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
  let filteredTenders = tenders.filter(item => item.tender.id === id);

  if (filteredTenders.length > 0)
    return buildResponse(200, filteredTenders.pop());

  return buildResponse(404, {
    message: 'Tender not found.'
  });
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
