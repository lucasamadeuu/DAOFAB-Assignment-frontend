import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {

    private baseUrl = environment.backendApiUrl

    constructor(private http: HttpClient) { }

    getParentData(data: ParentPayload) {
        const parentUrl = `${this.baseUrl}/parent-transactions?page=${data.currentPage}&size=${data.pageSize}`

        return this.http.get(parentUrl);
    }

    getChildData(id: number) {
        const parentUrl = `${this.baseUrl}/child-transactions/${id}`

        return this.http.get(parentUrl);
    }
}
