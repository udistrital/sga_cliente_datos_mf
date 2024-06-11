export interface ApiMidResponse <T, M = any>{
    Success: boolean;
    Message: M;
    Data: T;
    Status: number;
}