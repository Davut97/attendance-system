import * as jwt from 'jsonwebtoken';

export function generateAccessToken(payload: any) {
  const {exp, ...payloadBody} = payload;
  const serializedPayload = JSON.parse(JSON.stringify(payloadBody));
  return jwt.sign(serializedPayload, process.env.ACCESS_SECRET_TOKEN!, {
    expiresIn: '15m',
  });
}

export function verifyJWTToken(token: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN!, (err, user) => {
      if (err) return reject(err);

      return resolve(user);
    });
  });
}
