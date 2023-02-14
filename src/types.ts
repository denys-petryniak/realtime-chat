import type { Ref } from 'vue';
import type { collection } from 'firebase/firestore';
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
