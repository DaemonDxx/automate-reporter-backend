export type Event$Base = {

};

export type Payload$FileUpload = {
  filename: string;
  user_id: string;
};

export type Event$FileUpload = Event$Base & Payload$FileUpload;

