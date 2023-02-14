import type { Ref } from 'vue';
import type {
  collection,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import type { StorageReference } from 'firebase/storage';

export interface Chat {
  id: string;
  owner: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  members: string[];
}

export interface ChatsStore {
  chatsCollection: ReturnType<typeof collection>;
  getChats: (id: string) => {
    ownedChats: Ref<Chat[] | null>;
    unownedChats: Ref<Chat[] | null>;
    loading: Ref<boolean>;
    error: Ref<Error | null>;
  };
}

export interface Message {
  uid: string;
  id: string;
  sender: string | undefined;
  createdAt: number;
  text: string;
  audioURL: string | null;
}

export interface MessagesStore {
  getMessagesCollectionDocRef: (id: string) => DocumentReference<DocumentData>;
  getMessages: (id: string) => {
    messages: Ref<Message[]>;
    loading: Ref<boolean>;
  };
  getAudioStorageRef: (id: string) => StorageReference;
  setNewMessageDoc: ({
    id,
    text,
    sender,
    audioURL,
    uid,
  }: Message) => Promise<void>;
}

export interface UserStore {
  currentUser: Ref<any>; // waiting for better typing VueFire
  getUserName: Ref<string | undefined>;
}

export interface UserCredentials {
  email: string;
  password: string;
}
