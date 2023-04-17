import { MongoClient } from 'mongodb';
import { mongo } from './config';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';


let mongodb;
let client;


export const mongoConnect = async (): Promise<void> => {
  client = new MongoClient(mongo.url);
  await client.connect();

  mongodb = client.db(mongo.db);
};

export const mongoCollection = (collectionName: string) => mongodb.collection(collectionName);
