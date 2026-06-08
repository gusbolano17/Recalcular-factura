export interface ResponseDto<T>{
    mensaje : string;
    codigo : number;
    body : T
}