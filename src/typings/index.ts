import * as mongoose from 'mongoose';

export type Timestamp = {
  createAt?: number;
  updateAt?: number;
};

export type MongooseID = {
  _id: mongoose.Schema.Types.ObjectId;
};
