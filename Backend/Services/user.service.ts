import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // ======================================================
  // 🔥 GET ALL USERS
  // ======================================================
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // ======================================================
  // 🔥 GET USER BY ID OU KEY
  // ======================================================
  getUser(idOrKey: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idOrKey}`);
  }

  // (option compat ancienne)
  getUserById(id: string): Observable<any> {
    return this.getUser(id);
  }

  // ======================================================
  // 🔥 UPDATE USER (ID OU KEY)
  // ======================================================
  updateUser(idOrKey: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idOrKey}`, data);
  }

  // ======================================================
  // 🗑️ DELETE USER (ID OU KEY)
  // ======================================================
  deleteUser(idOrKey: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idOrKey}`);
  }

  // ======================================================
  // 🔥 UPDATE ROLE BY KEY (option séparée)
  // ======================================================
  updateRoleByKey(key: string, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${key}/role`, { role });
  }

  // ======================================================
  // 🔥 GET USER BY EMAIL
  // ======================================================
  getUserByEmail(email: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/email/${encodeURIComponent(email)}`
    );
  }

  // ======================================================
  // 🔐 RESET PASSWORD MAIL
  // ======================================================
  sendResetPassword(email:string): Observable<any>{

    return this.http.post(
      'http://localhost:3000/api/reset-password/send-reset',
      {
        email: email
      }
    );

  }

  // ======================================================
// 🔐 MODIFICATION PASSWORD AVEC KEY RESET
// ======================================================

resetPassword(data:any){

  return this.http.patch(

    `${this.apiUrl}/reset-password`,

    data

  );

}

// ======================================================
// 🔑 VERIFIER CLE RESET PASSWORD
// ======================================================

verifyResetKey(data:any){

  return this.http.post(

    `${this.apiUrl}/verify-reset-key`,

    data

  );

}

}