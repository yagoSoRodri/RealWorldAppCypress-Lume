export const userSchema = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        uuid: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        phoneNumber: { type: 'string' },
        balance: { type: 'integer' },
        avatar: { type: 'string', format: 'uri' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'firstName', 'lastName', 'username'],
    },
  },
};

export const usersListSchema = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          username: { type: 'string' },
        },
        required: ['id', 'firstName', 'lastName', 'username'],
      },
    },
  },
  required: ['results'],
};
