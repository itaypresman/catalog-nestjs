type Tokens = {
  refreshToken: string;
  accessToken: string;
};

type TokenMongo = {
  refreshToken: string;
  accessToken: string;
  createTime: Date;
  device: string;
  isActive: boolean;
};

type SignResponse = {
  accessToken: string;
}

type LogOutResponse = {
  status: boolean;
}

