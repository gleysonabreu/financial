export default {
  hashSaltRounds: 10,
  jwt: {
    duration: (process.env.JWT_DURATION as string) || '1h',
    privateKey: process.env.JWT_PRIVATE_KEY as string,
    publicKey: process.env.JWT_PUBLIC_KEY as string,
  },
};
