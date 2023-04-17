type Tokens = {
  refreshToken: string;
  accessToken: string;
};

type TokenMongo = {
  token: string;
  createTime: Date;
  device: string;
  isActive: boolean;
};

type SignResponse = {
  accessToken: string;
}
