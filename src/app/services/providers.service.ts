import { Injectable, inject } from '@angular/core';
import { Provider } from '../models/provider';

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
export class ProvidersService {
  private fs = inject(Firestore);

  dbPath: string = 'mintraker17_providers';

  getProviders(): Observable<Provider[]> {
    let providerRef = collection(this.fs, `${this.dbPath}`);
    return collectionData(providerRef, { idField: 'id' }) as Observable<
      Provider[]
    >;
  }

  getProvider(id: string): Observable<Provider> {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Provider>;
  }

  addProvider(provider: Provider) {
    return addDoc(collection(this.fs, `${this.dbPath}`), provider);
  }

  updateProvider(id: string, providers: any) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return updateDoc(docRef, providers);
  }

  deleteProvider(id: string) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
