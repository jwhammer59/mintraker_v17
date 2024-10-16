import { Injectable, inject } from '@angular/core';
import { Member } from '../models/member';

import {
  Firestore,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
  docData,
} from '@angular/fire/firestore';

import { collection } from '@firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private fs = inject(Firestore);

  dbPath: string = 'mintraker17_members';

  getMembers(): Observable<Member[]> {
    let memberRef = collection(this.fs, `${this.dbPath}`);
    return collectionData(memberRef, { idField: 'id' }) as Observable<Member[]>;
  }

  getMember(id: string): Observable<Member> {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Member>;
  }

  addMember(member: Member) {
    return addDoc(collection(this.fs, `${this.dbPath}`), member);
  }

  updateMember(id: string, members: any) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return updateDoc(docRef, members);
  }

  deleteMember(id: string) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
