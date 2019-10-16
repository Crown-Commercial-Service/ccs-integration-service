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
      projectCode: 'string',
      ittCode: 'string'
    });
  } catch (err) {
    return buildResponse(401, {
      message: err.message
    });
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
